import { create } from "zustand";
import { deleteQuiz, fetchQuizzes } from "../api/supabaseApi.js";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/questions";

export type QuizzesStatus = "idle" | "loading" | "onGoing" | "finished" | "ready";

interface SelectedAnswer {
  questionId: string;
  answer: { 
    answerId: string,
    correctAnswer: boolean 
  };
}

interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  curQuestion: Question | null;
  status: QuizzesStatus;
  error: unknown | null;
  timer: number;
  pointsPerQuestion: number;
  totalScore: number;
  selectedAnswers: SelectedAnswer[];
  numCorrectAnswers: number | null;


}

interface QuizzesActions {
  // Data
  setQuizzes: (quizzes: Quiz[]) => void;
  setCurrentQuiz: (quiz: Quiz) => void;
  setCurQuestion: (question: Question | null ) => void;
  setError: (error: unknown) => void;

  // Quiz-taking
  startQuiz: () => void;
  tick: () => void;
  selectAnswer: (payload: SelectedAnswer) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  removeQuiz: (quizId: string) => void;

  // Async thunks
  handleGetUserQuizzes: (userId: string) => Promise<void>;
  handleDeleteQuiz: (quizId: string) => Promise<unknown>;
}

type QuizzesStore = QuizzesState & QuizzesActions;

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  curQuestion: null,
  status: "idle",
  error: null,
  timer: 0,
  pointsPerQuestion: 15,
  totalScore: 0,
  selectedAnswers: [],
  numCorrectAnswers: null,

};

export const useQuizzesStore = create<QuizzesStore>()((set, get) => ({
  ...initialState,

  // ── Data ─────────────────────────────────────────────────────────────────
  setQuizzes: (quizzes) => set({ quizzes, status: "ready" }),

  setCurrentQuiz: (quiz) => 
    set({ currentQuiz: quiz, status: 'ready' }),

  setCurQuestion: (question) => {

    set({ curQuestion: question })},

  setError: (error) => set({ error }),

  // ── Quiz-taking ───────────────────────────────────────────────────────────
  startQuiz: () =>
    set((state) => (
      {
      timer: (state.currentQuiz?.questions.length ?? 0) * 60,
      status: "onGoing",
      selectedAnswers: [],
      numCorrectAnswers: null,
      totalScore: 0,
    })),

  tick: () =>
    set((state) => ({
      timer: state.timer - 1,
      status: state.timer === 0 ? "finished" : state.status,
    })),

  selectAnswer: (payload) =>
    set((state) => {
      const exists = state.selectedAnswers.some(
        (a) => a.questionId === payload.questionId
      );
      const selectedAnswers = exists
        ? state.selectedAnswers.map((a) =>
            a.questionId === payload.questionId ? payload : a
          )
        : [...state.selectedAnswers, payload];
        console.log('selectedAnswer')
      return { selectedAnswers };
    }),

  submitQuiz: () =>
    set((state) => {
      const numCorrectAnswers = state.selectedAnswers.filter(
        (a) => a.answer.correctAnswer
      ).length;

      return {
        status: "finished",
        totalScore: numCorrectAnswers * state.pointsPerQuestion,
        numCorrectAnswers,
      };
    }),

  resetQuiz: () => set({ ...initialState }),

  removeQuiz: (quizId) =>
    set((state) => ({
      quizzes: state.quizzes.filter((q) => q.quizId !== quizId),
      status: "ready",
    })),


  // ── Async thunks ─────────────────────────────────────────────────────────
  handleGetUserQuizzes: async (userId) => {
    set({ status: "loading" });
    try {
      if (!userId) return;
      const data = await fetchQuizzes(userId);
      get().setQuizzes(data ?? []);
    } catch (error) {
      console.error(error);
      get().setError(error);
    }
  },

  handleDeleteQuiz: async (quizId) => {
    try {
      const res = await deleteQuiz(quizId);
      get().removeQuiz(quizId);
      return res;
    } catch (error) {
      console.error(error);
      get().setError(error);
      throw error;
    }
  },
}));

export const useQuizzes = useQuizzesStore