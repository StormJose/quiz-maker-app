import { createContext, useContext, useReducer } from "react";
import {
  deleteAnswer,
  deleteQuestion,
  fetchNumOfQuizzes,
  fetchQuiz,
  insertQuiz,
  updateQuiz,
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

function reducer(state, action) {
  switch (action.type) {
    case "dataLoading":
      return {
        ...state,
        isLoading: true,
      };
    case "dataLoaded":
      return {
        ...state,
        isLoading: false,
        status: "ready",
      };
    case "setNewQuiz": {
      console.log(action.payload);
      return {
        ...state,
        numQuizzes: action.payload,
        currentQuiz: {
          ...initialState.currentQuiz,
          title: `Novo Quiz ${action.payload + 1}`,
          id: new Date().getTime().toString(),
        },
        curQuestion: initialState.currentQuiz.questions[0],
        isLoading: false,
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
      const newId = state.currentQuiz.questions.length
        ? Math.max(
            ...state.currentQuiz.questions.map((question) => question?.id)
          ) + 1
        : 1;

      const newOrder = state.currentQuiz.questions.length + 1;

      const newQuestion = {
        id: newId,
        description: `Nova pergunta ${newOrder}`,
        answers: state.currentQuiz.questions[0].answers.map((a, index) => ({
          ...a,
          id: new Date().getTime() + index,
          order: index + 1,
        })),
        type: "multiple_choice",
        order: newOrder,
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state.currentQuiz?.questions, newQuestion],
        },
        persist: true,
      };
    }

    case "addTrueOrFalseQuestion": {
      const newId = state.currentQuiz.questions.length
        ? Math.max(
            ...state.currentQuiz.questions.map((question) => question?.id)
          ) + 1
        : 1;

      const newOrder = state.currentQuiz.questions.length + 1;

      const newQuestion = {
        id: newId,
        description: `Nova Pergunta ${newId}`,
        answers: [
          {
            id: Date.now(),
            content: "Verdadeiro",
            correct_answer: true,
          },
          {
            id: Date.now() + 1,
            content: "Falso",
            correct_answer: false,
          },
        ],
        type: "true_false",
        order: newOrder,
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state?.currentQuiz.questions, newQuestion],
        },
        persist: true,
      };
    }

    case "cloneQuestion": {
      const newId = state.currentQuiz.questions.length
        ? Math.max(
            ...state.currentQuiz.questions?.map((question) => question?.id)
          ) + 1
        : 1;

      const newOrder = state.currentQuiz.questions.length + 1;
      const clonedQuestion = {
        ...state.curQuestion,
        answers: state.curQuestion.answers.map((a, i) => ({
          ...a,
          id: Date.now() + i,
        })),
        id: newId,
        order: newOrder,
      };
      console.log(clonedQuestion);

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state?.currentQuiz.questions, clonedQuestion],
        },
        persist: true,
      };
    }
    case "updateQuestion": {
      const newQuestions = state.currentQuiz.questions.map((question) =>
        question.id === action.payload.id ? action.payload : question
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: newQuestions,
        },
        curQuestion: newQuestions.filter(
          (question) => question.id === action.payload.id
        )[0],
        persist: true,
      };
    }

    case "deleteQuestion": {
      const updatedQuestions = state.currentQuiz.questions.filter(
        (question) => question.id !== action.payload
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
        },
        curQuestion: updatedQuestions[0],
        persist: false,
      };
    }

    case "deleteAnswer": {
      const updatedQuestion = {
        ...state.curQuestion,
        answers: state.curQuestion.answers.filter(
          (a) => a.id !== action.payload
        ),
      };

      const updatedQuestions = state.currentQuiz.questions.filter(
        (question) => question.id !== updatedQuestion
      );

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
          curQuestion: updatedQuestions[0],
        },
        persist: false,
      };
    }

    case "reorderQuestions":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: action.payload,
        },
        persist: true,
      };

    case "reorderAnswers": {
      const updatedQuestions = state.currentQuiz.questions.map((question) =>
        question.id === action.payload.questionId
          ? { ...question, answers: action.payload.newArray }
          : question
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
        question.id === action.payload.questionId
          ? { ...question, answers: action.payload.answers }
          : question
      );

      const updatedCurQuestion = updatedQuestions?.find(
        (question) => question.id === action.payload.questionId
      );

      console.log(updatedCurQuestion);
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

    case "saveDraft":
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
          settings: {
            ...state.currentQuiz.settings,
            enableTimer: state.currentQuiz.settings.enableTimer ? false : true,
          },
        },
      };

    case "setShuffle":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          settings: {
            ...state.currentQuiz.settings,
            shuffle: state.currentQuiz.settings.shuffle ? false : true,
          },
        },
      };

    case "setCustomScore":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          settings: {
            ...state.currentQuiz.settings,
            customScore: state.currentQuiz.settings.customScore ? false : true,
          },
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
      questions,
      curQuestion,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const toggleTimer = () => dispatch({ type: "setTimer" });
  const toggleShuffle = () => dispatch({ type: "setShuffle" });
  const toggleCustomScore = () => dispatch({ type: "setCustomScore" });

  async function handleNumOfQuizzes(filters) {
    const numQuizzes = await fetchNumOfQuizzes(filters);

    return numQuizzes;
  }

  async function handleNewQuiz() {
    dispatch({ type: "dataLoading" });
    try {
      const numQuizzes = await handleNumOfQuizzes();

      dispatch({ type: "setNewQuiz", payload: numQuizzes });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  // quizzes
  async function handleGetQuiz(quizId) {
    dispatch({ type: "dataLoading" });
    try {
      const data = await fetchQuiz(quizId);

      dispatch({ type: "setCurrentQuiz", payload: data });
      return data;
    } catch (error) {
      dispatch({ type: "setError", payload: error });
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  async function handleInsertQuiz(quiz) {
    dispatch({ type: "dataLoading" });
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
  async function handleDeleteAnswer(answerId) {
    dispatch({ type: "dataLoading" });
    try {
      const result = await deleteAnswer(answerId);

      if (result) dispatch({ type: "deleteAnswer", answerId });
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
        questions,
        curQuestion,
        handleNumOfQuizzes,
        handleNewQuiz,
        handleGetQuiz,
        handleInsertQuiz,
        handleUpsertQuizSettings,
        // handleUpdateQuiz,
        handleDeleteQuestion,
        handleDeleteAnswer,
        toggleShuffle,
        toggleTimer,
        toggleCustomScore,
        dispatch,
      }}>
      {children}
    </BuilderContext.Provider>
  );
}

function useBuilder() {
    const context = useContext(BuilderContext)

    if (context === undefined) throw new Error('Tentou acessar o Context fora do Provider')

    return context
}


export {
    BuilderProvider, useBuilder
}