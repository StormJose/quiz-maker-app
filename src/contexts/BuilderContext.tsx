import { createContext, useContext, useReducer } from "react";
import { fetchQuiz, addQuiz, updateQuiz } from "../api/supabaseApi.js";

const BuilderContext = createContext();

const initialState = {
  isLoading: false,
  status: "pending",
  // "Saving" | "Saved" | "Offline">
  draftStatus: "Saving",
  hasRestored: false,
  lastSynced: null,
  enableTimer: false,
  shuffle: false,
  customScore: false,
  currentQuiz: {
    id: null,
    title: "",
    questions: [
      {
        id: 1,
        description: "Essa é sua primeira pergunta",
        answers: [
          {
            id: 1,
            content: "Essa é sua primeira resposta 1",
            correct_answer: true,
          },
          {
            id: 2,
            content: "Resposta 2",
            correct_answer: false,
          },
          {
            id: 3,
            content: "Resposta 3",
            correct_answer: false,
          },
          {
            id: 4,
            content: "Resposta 4",
            correct_answer: false,
          },
        ],
      },
    ],
  },
  curQuestion: {},
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "DataLoading":
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
      return {
        ...state,
        currentQuiz: {
          ...initialState.currentQuiz,
          id: new Date().getTime().toString(),
          title: `Novo Quiz ${action.payload.length + 1}`,
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

      const newQuestion = {
        id: newId,
        description: `Nova pergunta ${newId}`,
        answers: initialState.currentQuiz.questions[0].answers,
        type: "multiChoice",
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state.currentQuiz?.questions, newQuestion],
        },
      };
    }

    case "addTrueOrFalseQuestion": {
      const newId = state.currentQuiz.questions.length
        ? Math.max(
            ...state.currentQuiz.questions.map((question) => question?.id)
          ) + 1
        : 1;

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
        type: "trueOrFalse",
      };

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state?.currentQuiz.questions, newQuestion],
        },
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
      };
    }

    case "reorderQuestions":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: action.payload,
        },
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
        draftStatus: action.payload,
        lastSynced: new Date().toLocaleString(),
      };

    case "setTimer":
      return {
        ...state,
        enableTimer: state.enableTimer ? false : true,
      };

    case "setSuffle":
      return {
        ...state,
        shuffle: state.shuffle ? false : true,
      };

    case "setCustomScore":
      return {
        ...state,
        customScore: state.customScore ? false : true,
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
      enableTimer,
      shuffle,
      customScore,
      currentQuiz,
      questions,
      curQuestion,
      title,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const toggleTimer = () => dispatch({ type: "setTimer" });
  const toggleSuffle = () => dispatch({ type: "setShuffle" });
  const toggleCustomScore = () => dispatch({ type: "setCustomScore" });

  async function handleGetQuiz(quizId) {
    dispatch({ type: "dataLoading" });
    try {
      const currentQuiz = await fetchQuiz(quizId);

      return currentQuiz;
    } catch (error) {
      console.error(error);
      dispatch({ type: "setError", payload: error });
    } finally {
      dispatch({ type: "dataLoaded" });
    }
  }

  async function handleSaveQuiz(quiz) {
    dispatch({ type: "dataLoading" });
    try {
      const res = await addQuiz(quiz);

      if (!res.ok) throw new Error("Erro ao salvar o quiz ;");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: "saveQuiz" });
    }
  }

  async function handleUpdateQuiz(quiz) {
    dispatch({ type: "dataLoading" });
    try {
      const result = await updateQuiz(quiz);

      console.log(result);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // dispatch({type: "saveQuiz"})
    }
  }

  return (
    <BuilderContext.Provider
      value={{
        isLoading,
        status,
        draftStatus,
        lastSynced,
        enableTimer,
        shuffle,
        customScore,
        currentQuiz,
        questions,
        curQuestion,
        title,
        handleGetQuiz,
        handleSaveQuiz,
        handleUpdateQuiz,
        toggleSuffle,
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