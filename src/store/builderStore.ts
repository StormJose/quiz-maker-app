import { create } from "zustand";
import {
  deleteAnswer,
  deleteQuestion,
  insertQuiz,
  upsertQuizSettings,
} from "../api/supabaseApi.js";
import { Answer } from "@/types/answers";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/questions";


export type DraftStatus = "Saving" | "Saved" | "Offline";
export type BuilderStatus = "pending" | "ready";

export interface QuizSettings {
  enableTimer: boolean;
  shuffle: boolean;
  customScore: boolean;
}


interface BuilderState {
  isLoading: boolean;
  status: BuilderStatus;
  draftStatus: DraftStatus;
  hasRestored: boolean;
  lastSynced: string | null;
  numQuizzes: number | null;
  currentQuiz: Quiz;
  curQuestion: Question | null;
  error: unknown | null;
  persist: boolean;
}

interface BuilderActions {
  // Loading
  setLoading: (loading: boolean) => void;

  // Quiz-level
  setCurrentQuiz: (quiz: Quiz | undefined, numQuizzes: number | null) => void;
  setCurQuestion: (question: Question) => void;
  setTitle: (title: string) => void;

  // Question mutations
  addQuestion: () => void;
  addTrueOrFalseQuestion: () => void;
  cloneQuestion: () => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
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
  toggleRealTimeAnswer: () => void;

  // Draft / save
  saveDraft: (status: DraftStatus) => void;
  saveQuiz: () => void;
  saveChanges: (quiz: Quiz) => void;

  // Misc
  setError: (error: unknown) => void;
  resetBuilder: () => void;

  // Async thunks
  // handleNewQuiz: () => Promise<void>;
  // handleGetQuiz: (quizId: string) => Promise<Quiz | undefined>;
  handleInsertQuiz: (quiz: Quiz) => Promise<unknown>;
  handleUpsertQuizSettings: (quiz: Quiz) => Promise<unknown>;
  handleDeleteQuestion: (questionId: string) => Promise<unknown>;
  handleDeleteAnswer: (answerId: string) => Promise<void>;
}

type BuilderStore = BuilderState & BuilderActions;

// ─── Initial state ────────────────────────────────────────────────────────────
// Declared outside create() so resetBuilder can spread it back cleanly.

const initialQuestion: Question = 
  {
        questionId: crypto.randomUUID(),
        description: "Essa é sua primeira pergunta",
        answers: [
          {
            answerId: crypto.randomUUID(),
            content: "Essa é sua primeira resposta 1",
            correctAnswer: true,
            order: 1,
          },
          {
            answerId: crypto.randomUUID(),
            content: "Resposta 2",
            correctAnswer: false,
            order: 2,
          },
          {
            answerId:crypto.randomUUID(),
            content: "Resposta 3",
            correctAnswer: false,
            order: 3,
          },
          {
            answerId: crypto.randomUUID(),
            content: "Resposta 4",
            correctAnswer: false,
            order: 4,
          },
        ],
        order: 1,
        type: "multiple_choice",
        pointsRewarded: 5
      }

    


const initialState: BuilderState = {
  isLoading: false,
  status: "pending",
  draftStatus: "Saving",
  hasRestored: false,
  lastSynced: null,
  numQuizzes: null,
  currentQuiz: {
    quizId: crypto.randomUUID(),
    title: "",
    description: "Seu novo quiz",
    questions: [
      initialQuestion
    ],
    enableTimer: false,
    shuffle: false,
    customScore: false,
    realTimeAnswer: false,
    published: false,
  },
  curQuestion: initialQuestion,
  error: null,
  persist: true,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderStore>()((set, get) => ({
  ...initialState,

  // ── Loading ──────────────────────────────────────────────────────────────
  setLoading: (loading) => set({ isLoading: loading }),

  // ── Quiz-level mutations ─────────────────────────────────────────────────

  setCurrentQuiz: (quiz, numQuizzes) => {
      // set({
      //   currentQuiz: quiz,
      //   curQuestion: quiz?.questions[0],
      //   isLoading: false,
      //   status: "ready",
      // })

      // console.log(quiz)
    if (!quiz) {
      set({
      numQuizzes,
      currentQuiz: {
        ...initialState.currentQuiz,
        title: `Novo Quiz ${numQuizzes ? numQuizzes + 1 : 0}`,
        quizId: crypto.randomUUID(),
      },
      curQuestion: initialState.currentQuiz.questions[0],
      isLoading: false,
      status: "ready"
    })
    } else {
      set({
        currentQuiz: quiz,
        curQuestion: quiz?.questions[0],
        isLoading: false,
        status: "ready",
      })
    }
  },

  setCurQuestion: (question) => set({ curQuestion: question }),

  setTitle: (title) =>
    set((state) => ({
      currentQuiz: { ...state.currentQuiz, title },
    })),

  // ── Question mutations ───────────────────────────────────────────────────
  addQuestion: () =>
    set((state) => {
      const questions = state.currentQuiz.questions;
      const newId = crypto.randomUUID()
      const newOrder = questions.length + 1;

      const newQuestion: Question = {
        questionId: newId,
        description: `Nova pergunta ${newOrder}`,
        answers: questions[0].answers.map((a, index) => ({
          ...a,
          answerId: crypto.randomUUID(),
          order: index + 1,
        })),
        type: "multiple_choice",
        order: newOrder,
        pointsRewarded: 5
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
      const newId = crypto.randomUUID()
      const newOrder = questions.length + 1;

      const newQuestion: Question = {
        questionId: newId,
        description: `Nova Pergunta ${newOrder}`,
        answers: [
          { answerId: crypto.randomUUID(), content: "Verdadeiro", correctAnswer: true, order: 1 },
          { answerId: crypto.randomUUID(), content: "Falso", correctAnswer: false, order: 2 },
        ],
        type: "true_false",
        order: newOrder,
        pointsRewarded: 5
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
      const newId = crypto.randomUUID()
      const newOrder = questions.length + 1;
      const curQuestion = state.curQuestion as Question;

      const clonedQuestion: Question = {
        ...curQuestion,
        answers: curQuestion.answers.map((a) => ({
          ...a,
          answerId: crypto.randomUUID(),
        })),
        questionId: newId,
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
        q.questionId === question?.questionId ? question : q
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: newQuestions },
        curQuestion:
          newQuestions.find((q) => q.questionId === question?.questionId) ?? state.curQuestion,
        persist: true,
      };
    }),

  deleteQuestion: (questionId) =>
    set((state) => {
      const updatedQuestions = state.currentQuiz.questions.filter(
        (q) => q.questionId !== questionId
      );

      return {
        currentQuiz: { ...state.currentQuiz, questions: updatedQuestions },
        curQuestion: updatedQuestions[0] ?? {},
        persist: false,
      };
    }),

  deleteAnswer: (answerId) =>
    set((state) => {
      const curQuestion = state.curQuestion as Question;
      const updatedQuestion: Question = {
        ...curQuestion,
        answers: curQuestion.answers.filter((a) => a.answerId !== answerId),
      };
      const updatedQuestions = state.currentQuiz.questions.map((q) =>
        q.questionId === updatedQuestion.questionId ? updatedQuestion : q
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
        q.questionId === questionId ? { ...q, answers: newArray } : q
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
        q.questionId === questionId ? { ...q, answers } : q
      );
      const updatedCurQuestion = updatedQuestions.find(
        (q) => q.questionId === questionId
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
        
        enableTimer: !state.currentQuiz.enableTimer,
        
      },
    })),

  toggleShuffle: () =>
    set((state) => ({
      currentQuiz: {
        ...state.currentQuiz,
        shuffle: !state.currentQuiz.shuffle,
        
      },
    })),

  toggleCustomScore: () =>
    set((state) => ({
      currentQuiz: {
        ...state.currentQuiz,
        
        customScore: !state.currentQuiz.customScore,
        
      },
    })),

    toggleRealTimeAnswer: () => 
      set((state) => ({
        currentQuiz: {
          ...state.currentQuiz,
          realTimeAnswer: !state.currentQuiz.realTimeAnswer
        }
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
      curQuestion: null,
      error: null,
    }),

  saveChanges: (quiz) => set({ currentQuiz: quiz }),

  // ── Misc ─────────────────────────────────────────────────────────────────
  setError: (error) => set({ error }),

  resetBuilder: () => set({ ...initialState }),

  // ── Async thunks ─────────────────────────────────────────────────────────
  // handleNumOfQuizzes: async (filters) => {
  //   const numQuizzes = await fetchNumOfQuizzes(filters);
  //   return numQuizzes;
  // },

  // handleNewQuiz: async () => {
  //   get().setLoading(true);
  //   try {
  //     const numQuizzes = await get().handleNumOfQuizzes();
  //     get().setCurrentQuiz(null, numQuizzes);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     get().setLoading(false);
  //   }
  // },

  // handleGetQuiz: async (quizId) => {
  //   get().setLoading(true);
  //   try {

  //     const numQuizzes = fetchNumOfQuizzes();
  //     const data = await fetchQuiz(quizId);
  //     get().setCurrentQuiz(data, numQuizzes);
  //     return data;
  //   } catch (error) {
  //     get().setError(error);
  //   } finally {
  //     get().setLoading(false);
  //   }
  // },

  handleInsertQuiz: async (quiz: Quiz) => {
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

  handleDeleteQuestion: async (questionId: string) => {
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
