import { createContext, useContext, useEffect, useReducer } from "react";
import {
  deleteAnswer,
  deleteQuestion,
  fetchNumOfQuizzes,
  insertQuiz,
  upsertQuizSettings,
} from "../api/supabaseApi.js";

const BuilderContext = createContext();

const initialState = {
  isLoading: false,
  status: "pending",
  // "Saving" | "Saved" | "Offline">
  draftStatus: "Saving",
  hasRestored: false,
  lastSynced: null,
  numQuizzes: null,
  currentQuiz: {
    quizId: null,
    title: "",
    description: "Seu Novo Quiz",
    questions: [
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
            content: "Essa é sua resposta 2",
            correctAnswer: false,
            order: 2,
          },
          {
            answerId: crypto.randomUUID(),
            content: "Essa é sua resposta 3",
            correctAnswer: false,
            order: 3,
          },
          {
            answerId: crypto.randomUUID(),
            content: "Essa é sua resposta 4",
            correctAnswer: false,
            order: 4,
          },
        ],
        order: 1,
        type: "multiple_choice",
        pointsRewarded: 5,
      },
    ],
    enableTimer: false,
    shuffle: false,
    customScore: false,
    realTimeAnswer: false,
    published: false,
  },
  curQuestion: {},
  error: null,
  persist: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataLoading":
      return {
        ...state,
        status: "loading",
      };
    case "dataLoaded":
      return {
        ...state,
        isLoading: false,
        status: "ready",
      };
    case "setNewQuiz": {
      return {
        ...state,
        currentQuiz: {
          ...initialState.currentQuiz,
          quizId: crypto.randomUUID(),
          title: `Novo Quiz ${action.payload + 1}`,
        },
        curQuestion: initialState.currentQuiz.questions[0],
        status: "ready",
      };
    }
    case "setCurrentQuiz":
      return {
        ...state,
        currentQuiz: action.payload,
        curQuestion: action.payload?.questions[0],
        status: "ready",
      };

    case "setCurQuestion":
      return {
        ...state,
        curQuestion: action.payload,
      };

    case "setTitle":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          title: action.payload,
        },
      };
    case "addQuestion": {
      const newId = crypto.randomUUID();

      const newOrder =
        state.currentQuiz.questions
          .map((q) => q)
          .sort((a, b) => b.order - a.order)[0].order + 1;

      const newQuestion = {
        questionId: newId,
        description: `Nova pergunta ${newOrder}`,
        answers: state.currentQuiz.questions[0].answers.map((a, index) => ({
          ...a,
          answerId: crypto.randomUUID(),
          order: index + 1,
        })),
        type: "multiple_choice",
        order: newOrder,
        pointsRewarded: 5,
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state.currentQuiz?.questions, newQuestion],
        },
        curQuestion: newQuestion,
        persist: true,
      };
    }

    case "addTrueOrFalseQuestion": {
      const newId = crypto.randomUUID();

      const newOrder =
        state.currentQuiz.questions
          .map((q) => q)
          .sort((a, b) => b.order - a.order)[0].order + 1;

      const newQuestion = {
        questionId: newId,
        description: `Nova Pergunta ${newOrder}`,
        answers: [
          {
            answerId: crypto.randomUUID(),
            content: "Verdadeiro",
            correctAnswer: true,
          },
          {
            answerId: crypto.randomUUID(),
            content: "Falso",
            correctAnswer: false,
          },
        ],
        type: "true_false",
        order: newOrder,
        pointsRewarded: 5,
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state?.currentQuiz.questions, newQuestion],
        },
        curQuestion: newQuestion,
        persist: true,
      };
    }

    case "cloneQuestion": {
      const newId = crypto.randomUUID();

      const newOrder =
        state.currentQuiz.questions
          .map((q) => q)
          .sort((a, b) => b.order - a.order)[0].order + 1;
      const clonedQuestion = {
        ...state.curQuestion,
        answers: state.curQuestion.answers.map((a) => ({
          ...a,
          answerId: crypto.randomUUID(),
        })),
        questionId: newId,
        description: state.curQuestion.description + " (Clone)",
        order: newOrder,
        type: state.curQuestion.type,
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state?.currentQuiz.questions, clonedQuestion],
        },
        curQuestion: clonedQuestion,
        persist: true,
      };
    }
    case "updateQuestion": {
      const newQuestions = state.currentQuiz.questions.map((question) =>
        question.questionId === action.payload.questionId
          ? action.payload
          : question,
      );

      const updatedCurQuestion = newQuestions.find(
        (question) => question.questionId === action.payload.questionId,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: newQuestions,
        },
        curQuestion: updatedCurQuestion,
        persist: true,
      };
    }

    case "deleteQuestion": {
      const newOrder =
        state.curQuestion.order != 1 ? state.curQuestion.order - 1 : 2;
      const newCurQuestion = state.currentQuiz.questions.find(
        (question) => question.order === newOrder,
      );
      const updatedQuestions = state.currentQuiz.questions
        .filter((question) => question.questionId !== action.payload)
        .map((question, i) =>
          question ? { ...question, order: i } : question,
        );

      const reorderedQuestions = updatedQuestions.map((question, i) =>
        question ? { ...question, order: i + 1 } : question,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: reorderedQuestions,
        },
        curQuestion: newCurQuestion,
        persist: false,
      };
    }

    case "deleteAnswer": {
      const updatedQuestion = {
        ...state.curQuestion,
        answers: state.curQuestion.answers.filter(
          (a) => a.answerId !== action.payload,
        ),
      };

      const updatedQuestions = state.currentQuiz.questions.map((question) =>
        updatedQuestion.questionId === question.questionId
          ? updatedQuestion
          : question,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
        },
        curQuestion: updatedQuestion,
        persist: false,
      };
    }

    case "reorderQuestions": {
      const newArrayOfQuestions = action.payload;

      const reorderedQuestions = newArrayOfQuestions.map((question, i) =>
        question ? { ...question, order: i + 1 } : question,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: reorderedQuestions,
        },
        persist: true,
      };
    }

    case "reorderAnswers": {
      const updatedQuestions = state.currentQuiz.questions.map((question) =>
        question.questionId === action.payload.questionId
          ? { ...question, answers: action.payload.newArray }
          : question,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
        },
        curQuestion: {
          ...state.curQuestion,
          answers: action.payload.newArray,
        },
        persist: true,
      };
    }

    case "setCorrectAnswer": {
      const updatedQuestions = state.currentQuiz.questions.map((question) =>
        question.questionId === action.payload.questionId
          ? { ...question, answers: action.payload.answers }
          : question,
      );

      const updatedCurQuestion = updatedQuestions?.find(
        (question) => question.questionId === action.payload.questionId,
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
        },
        curQuestion: updatedCurQuestion,
        persist: true,
      };
    }

    case "saveChanges":
      return {
        ...state,
        currentQuiz: action.payload,
      };

    case "saveQuiz":
      return {
        ...state,
        isLoading: false,
        currentQuiz: initialState.currentQuiz,
        curQuestion: {},
        error: null,
      };

    case "setSaveDraft":
      return {
        ...state,
        status: "ready",
        isLoading: false,
        draftStatus: action.payload,
        lastSynced: new Date().toLocaleString(),
      };

    case "setTimer":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          enableTimer: state.currentQuiz.enableTimer ? false : true,
        },
      };

    case "setShuffle":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          shuffle: state.currentQuiz.shuffle ? false : true,
        },
      };

    case "setCustomScore":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          customScore: state.currentQuiz.customScore ? false : true,
        },
      };

    case "setRealTimeAnswer":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          realTimeAnswer: state.currentQuiz.realTimeAnswer ? false : true,
        },
      };

    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    case "resetBuilder":
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

function BuilderProvider({ children }) {
  const [
    {
      isLoading,
      status,
      draftStatus,
      lastSynced,
      persist,
      currentQuiz,
      curQuestion,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const toggleTimer = () => dispatch({ type: "setTimer" });
  const toggleShuffle = () => dispatch({ type: "setShuffle" });
  const toggleCustomScore = () => dispatch({ type: "setCustomScore" });
  const toggleRealTimeAnswer = () => dispatch({ type: "setRealTimeAnswer" });

  useEffect(() => {}, [currentQuiz]);

  async function handleNumOfQuizzes(filters) {
    const numQuizzes = await fetchNumOfQuizzes(filters);

    return numQuizzes;
  }

  async function handleInsertQuiz(quiz) {
    try {
      const data = await insertQuiz(quiz);

      return data;
    } catch (error) {
      dispatch({ type: "setError", payload: error });
      throw error;
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  async function handleUpsertQuizSettings(quiz) {
    dispatch({ type: "dataLoading" });
    try {
      const data = await upsertQuizSettings(quiz);

      return data;
    } catch (error) {
      dispatch({ type: "setError", payload: error });
      throw error;
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  // Questions
  async function handleDeleteQuestion(questionId) {
    dispatch({ type: "dataLoading" });
    try {
      const result = await deleteQuestion(questionId);

      dispatch({
        type: "deleteQuestion",
        payload: questionId,
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  // Answers
  async function handleDeleteAnswer(answerId: string) {
    dispatch({ type: "dataLoading" });
    try {
      const result = await deleteAnswer(answerId);
      console.log(result);
      if (result) dispatch({ type: "deleteAnswer", payload: answerId });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  return (
    <BuilderContext.Provider
      value={{
        isLoading,
        status,
        draftStatus,
        lastSynced,
        persist,
        currentQuiz,
        curQuestion,
        handleNumOfQuizzes,
        handleInsertQuiz,
        handleUpsertQuizSettings,
        handleDeleteQuestion,
        handleDeleteAnswer,
        toggleShuffle,
        toggleTimer,
        toggleCustomScore,
        toggleRealTimeAnswer,
        dispatch,
      }}>
      {children}
    </BuilderContext.Provider>
  );
}

function useBuilder() {
  const context = useContext(BuilderContext);

  if (context === undefined)
    throw new Error("Tentou acessar o Context fora do Provider");

  return context;
}

export { BuilderProvider, useBuilder };
