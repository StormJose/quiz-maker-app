import { create } from "zustand";
import {
  deleteAnswer,
  deleteQuestion,
  fetchNumOfQuizzes,
  fetchQuiz,
  insertQuiz,
  upsertQuizSettings,
} from "../api/supabaseApi.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DraftStatus = "Saving" | "Saved" | "Offline";
export type BuilderStatus = "pending" | "ready";

export interface Answer {
  id: number | string;
  content: string;
  correct_answer: boolean;
  order?: number;
}

export interface Question {
  id: number | string;
  description: string;
  answers: Answer[];
  order: number;
  type: "multiple_choice" | "true_false";
}

export interface QuizSettings {
  enableTimer: boolean;
  shuffle: boolean;
  customScore: boolean;
}

export interface Quiz {
  id: string | null;
  title: string;
  description: string;
  questions: Question[];
  settings: QuizSettings;
  published: boolean;
}

interface BuilderState {
  isLoading: boolean;
  status: BuilderStatus;
  draftStatus: DraftStatus;
  hasRestored: boolean;
  lastSynced: string | null;
  numQuizzes: number | null;
  currentQuiz: Quiz;
  curQuestion: Question | Record<string, never>;
  error: unknown | null;
  persist: boolean;
}

interface BuilderActions {
  // Loading
  setLoading: (loading: boolean) => void;

  // Quiz-level
  setNewQuiz: (numQuizzes: number) => void;
  setCurrentQuiz: (quiz: Quiz) => void;
  setCurQuestion: (question: Question) => void;
  setTitle: (title: string) => void;

  // Question mutations
  addQuestion: () => void;
  addTrueOrFalseQuestion: () => void;
  cloneQuestion: () => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: number | string) => void;
  deleteAnswer: (answerId: number | string) => void;

  // Reordering
  reorderQuestions: (questions: Question[]) => void;
  reorderAnswers: (payload: {
    questionId: number | string;
    newArray: Answer[];
  }) => void;

  // Answer state
  setCorrectAnswer: (payload: {
    questionId: number | string;
    answers: Answer[];
  }) => void;

  // Settings toggles
  toggleTimer: () => void;
  toggleShuffle: () => void;
  toggleCustomScore: () => void;

  // Draft / save
  saveDraft: (status: DraftStatus) => void;
  saveQuiz: () => void;
  saveChanges: (quiz: Quiz) => void;

  // Misc
  setError: (error: unknown) => void;
  resetBuilder: () => void;

  // Async thunks
  handleNumOfQuizzes: (filters?: {
    column: string;
    value: unknown;
  }) => Promise<number>;
  handleNewQuiz: () => Promise<void>;
  handleGetQuiz: (quizId: string) => Promise<Quiz | undefined>;
  handleInsertQuiz: (quiz: Quiz) => Promise<unknown>;
  handleUpsertQuizSettings: (quiz: Quiz) => Promise<unknown>;
  handleDeleteQuestion: (questionId: number | string) => Promise<unknown>;
  handleDeleteAnswer: (answerId: number | string) => Promise<void>;
}

type BuilderStore = BuilderState & BuilderActions;

// ─── Initial state ────────────────────────────────────────────────────────────
// Declared outside create() so resetBuilder can spread it back cleanly.

const initialState: BuilderState = {
  isLoading: false,
  status: "pending",
  draftStatus: "Saving",
  hasRestored: false,
  lastSynced: null,
  numQuizzes: null,
  currentQuiz: {
    id: null,
    title: "",
    description: "Seu novo quiz",
    questions: [
      {
        id: new Date().getTime(),
        description: "Essa é sua primeira pergunta",
        answers: [
          {
            id: new Date().getTime() + 1,
            content: "Essa é sua primeira resposta 1",
            correct_answer: true,
            order: 1,
          },
          {
            id: new Date().getTime() + 2,
            content: "Resposta 2",
            correct_answer: false,
            order: 2,
          },
          {
            id: new Date().getTime() + 3,
            content: "Resposta 3",
            correct_answer: false,
            order: 3,
          },
          {
            id: new Date().getTime() + 4,
            content: "Resposta 4",
            correct_answer: false,
            order: 4,
          },
        ],
        order: 1,
        type: "multiple_choice",
      },
    ],
    settings: {
      enableTimer: false,
      shuffle: false,
      customScore: false,
    },
    published: false,
  },
  curQuestion: {},
  error: null,
  persist: true,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderStore>()((set, get) => ({
  ...initialState,

  // ── Loading ──────────────────────────────────────────────────────────────
  setLoading: (loading) => set({ isLoading: loading }),

  // ── Quiz-level mutations ─────────────────────────────────────────────────
  setNewQuiz: (numQuizzes) =>
    set({
      numQuizzes,
      currentQuiz: {
        ...initialState.currentQuiz,
        title: `Novo Quiz ${numQuizzes + 1}`,
        id: new Date().getTime().toString(),
      },
      curQuestion: initialState.currentQuiz.questions[0],
      isLoading: false,
    }),

  setCurrentQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      curQuestion: quiz?.questions[0],
      status: "ready",
    }),

  setCurQuestion: (question) => set({ curQuestion: question }),

  setTitle: (title) =>
    set((state) => ({
      currentQuiz: { ...state.currentQuiz, title },
    })),

  // ── Question mutations ───────────────────────────────────────────────────
  addQuestion: () =>
    set((state) => {
      const questions = state.currentQuiz.questions;
      const newId = questions.length
        ? Math.max(...questions.map((q) => Number(q.id))) + 1
        : 1;
      const newOrder = questions.length + 1;

      const newQuestion: Question = {
        id: newId,
        description: `Nova pergunta ${newOrder}`,
        answers: questions[0].answers.map((a, index) => ({
          ...a,
          id: new Date().getTime() + index,
          order: index + 1,
        })),
        type: "multiple_choice",
        order: newOrder,
      };

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...questions, newQuestion],
        },
        persist: true,
      };
    }),

  addTrueOrFalseQuestion: () =>
    set((state) => {
      const questions = state.currentQuiz.questions;
      const newId = questions.length
        ? Math.max(...questions.map((q) => Number(q.id))) + 1
        : 1;
      const newOrder = questions.length + 1;

      const newQuestion: Question = {
        id: newId,
        description: `Nova Pergunta ${newId}`,
        answers: [
          { id: Date.now(), content: "Verdadeiro", correct_answer: true },
          { id: Date.now() + 1, content: "Falso", correct_answer: false },
        ],
        type: "true_false",
        order: newOrder,
      };

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...questions, newQuestion],
        },
        persist: true,
      };
    }),

  cloneQuestion: () =>
    set((state) => {
      const questions = state.currentQuiz.questions;
      const newId = questions.length
        ? Math.max(...questions.map((q) => Number(q.id))) + 1
        : 1;
      const newOrder = questions.length + 1;
      const curQuestion = state.curQuestion as Question;

      const clonedQuestion: Question = {
        ...curQuestion,
        answers: curQuestion.answers.map((a, i) => ({
          ...a,
          id: Date.now() + i,
        })),
        id: newId,
        order: newOrder,
      };

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...questions, clonedQuestion],
        },
        persist: true,
      };
    }),

  updateQuestion: (question) =>
    set((state) => {
      const newQuestions = state.currentQuiz.questions.map((q) =>
        q.id === question.id ? question : q
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: newQuestions },
        curQuestion:
          newQuestions.find((q) => q.id === question.id) ?? state.curQuestion,
        persist: true,
      };
    }),

  deleteQuestion: (questionId) =>
    set((state) => {
      const updatedQuestions = state.currentQuiz.questions.filter(
        (q) => q.id !== questionId
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: updatedQuestions },
        curQuestion: updatedQuestions[0] ?? {},
        persist: false,
      };
    }),

  // BUG FIX: original reducer compared question.id to an object (updatedQuestion)
  // instead of updatedQuestion.id, silently filtering nothing out.
  deleteAnswer: (answerId) =>
    set((state) => {
      const curQuestion = state.curQuestion as Question;
      const updatedQuestion: Question = {
        ...curQuestion,
        answers: curQuestion.answers.filter((a) => a.id !== answerId),
      };
      const updatedQuestions = state.currentQuiz.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: updatedQuestions },
        curQuestion: updatedQuestion,
        persist: false,
      };
    }),

  // ── Reordering ───────────────────────────────────────────────────────────
  reorderQuestions: (questions) =>
    set((state) => ({
      currentQuiz: { ...state.currentQuiz, questions },
      persist: true,
    })),

  reorderAnswers: ({ questionId, newArray }) =>
    set((state) => {
      const updatedQuestions = state.currentQuiz.questions.map((q) =>
        q.id === questionId ? { ...q, answers: newArray } : q
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: updatedQuestions },
        curQuestion: { ...(state.curQuestion as Question), answers: newArray },
        persist: true,
      };
    }),

  // ── Correct answer ───────────────────────────────────────────────────────
  setCorrectAnswer: ({ questionId, answers }) =>
    set((state) => {
      const updatedQuestions = state.currentQuiz.questions.map((q) =>
        q.id === questionId ? { ...q, answers } : q
      );
      const updatedCurQuestion = updatedQuestions.find(
        (q) => q.id === questionId
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: updatedQuestions },
        curQuestion: updatedCurQuestion ?? state.curQuestion,
        persist: true,
      };
    }),

  // ── Settings toggles ─────────────────────────────────────────────────────
  toggleTimer: () =>
    set((state) => ({
      currentQuiz: {
        ...state.currentQuiz,
        settings: {
          ...state.currentQuiz.settings,
          enableTimer: !state.currentQuiz.settings.enableTimer,
        },
      },
    })),

  toggleShuffle: () =>
    set((state) => ({
      currentQuiz: {
        ...state.currentQuiz,
        settings: {
          ...state.currentQuiz.settings,
          shuffle: !state.currentQuiz.settings.shuffle,
        },
      },
    })),

  toggleCustomScore: () =>
    set((state) => ({
      currentQuiz: {
        ...state.currentQuiz,
        settings: {
          ...state.currentQuiz.settings,
          customScore: !state.currentQuiz.settings.customScore,
        },
      },
    })),

  // ── Draft / save ─────────────────────────────────────────────────────────
  saveDraft: (status) =>
    set({
      status: "ready",
      isLoading: false,
      draftStatus: status,
      lastSynced: new Date().toLocaleString(),
    }),

  saveQuiz: () =>
    set({
      isLoading: false,
      currentQuiz: initialState.currentQuiz,
      curQuestion: {},
      error: null,
    }),

  saveChanges: (quiz) => set({ currentQuiz: quiz }),

  // ── Misc ─────────────────────────────────────────────────────────────────
  setError: (error) => set({ error }),

  resetBuilder: () => set({ ...initialState }),

  // ── Async thunks ─────────────────────────────────────────────────────────
  handleNumOfQuizzes: async (filters) => {
    const numQuizzes = await fetchNumOfQuizzes(filters);
    return numQuizzes;
  },

  handleNewQuiz: async () => {
    get().setLoading(true);
    try {
      const numQuizzes = await get().handleNumOfQuizzes();
      get().setNewQuiz(numQuizzes);
    } catch (error) {
      console.error(error);
    } finally {
      get().setLoading(false);
    }
  },

  handleGetQuiz: async (quizId) => {
    get().setLoading(true);
    try {
      const data = await fetchQuiz(quizId);
      get().setCurrentQuiz(data);
      return data;
    } catch (error) {
      get().setError(error);
    } finally {
      get().setLoading(false);
    }
  },

  handleInsertQuiz: async (quiz) => {
    get().setLoading(true);
    try {
      const data = await insertQuiz(quiz);
      return data;
    } catch (error) {
      get().setError(error);
      throw error;
    } finally {
      get().setLoading(false);
    }
  },

  handleUpsertQuizSettings: async (quiz) => {
    get().setLoading(true);
    try {
      const data = await upsertQuizSettings(quiz);
      return data;
    } catch (error) {
      get().setError(error);
      throw error;
    } finally {
      get().setLoading(false);
    }
  },

  handleDeleteQuestion: async (questionId) => {
    get().setLoading(true);
    try {
      const result = await deleteQuestion(questionId);
      get().deleteQuestion(questionId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      get().setLoading(false);
    }
  },

  // BUG FIX: original dispatched { type, answerId } instead of { type, payload }
  // so the reducer read action.payload === undefined and nothing was deleted.
  handleDeleteAnswer: async (answerId) => {
    get().setLoading(true);
    try {
      const result = await deleteAnswer(answerId);
      if (result) get().deleteAnswer(answerId);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      get().setLoading(false);
    }
  },
}));

// ─── Compatibility hook ───────────────────────────────────────────────────────
// Keeps the existing `useBuilder()` call signature across all consumers.
// For fine-grained subscriptions, call useBuilderStore(s => s.field) directly.
export function useBuilder() {
  return useBuilderStore();
}
