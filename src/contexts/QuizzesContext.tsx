import { createContext, useContext, useEffect, useReducer } from "react";
import { fetchQuizzes, deleteQuiz } from "../api/supabaseApi.js";

const QuizzesContext = createContext();

const initialState = {
  quizzes: [],
  currentQuiz: null,
  curQuestion: {},
  status: "idle",
  error: null,
  timer: 0,
  pointsPerQuestion: 15,
  totalScore: 0,
  selectedAnswers: [],
  numCorrectAnswers: null,
  confirmHandler: null,
  confirmData: null,
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
        quizzes: action.payload,
        status: "idle",
      };
    case "setCurrentQuiz":
      console.log(action.payload);
      return {
        ...state,
        currentQuiz: action.payload,
        curQuestion: action.payload.questions[0],
      };

    case "startQuiz":
      return {
        ...state,
        timer: state.currentQuiz.questions.length * 60,
        status: "onGoing",
      };

    case "tick":
      return {
        ...state,
        timer: state.timer - 1,
        status: state.timer === 0 ? "finished" : state.status,
      };

    case "selectAnswer": {
      const exists = state.selectedAnswers.some(
        (selectedAnswer) =>
          selectedAnswer.questionId === action.payload.questionId
      );

      const updatedAnswers = exists
        ? state.selectedAnswers.map((selectedAnswer) =>
            selectedAnswer.questionId === action.payload.questionId
              ? action.payload
              : selectedAnswer
          )
        : [...state.selectedAnswers, action.payload];

      return {
        ...state,
        selectedAnswers: updatedAnswers,
      };
    }

    case "setCurQuestion":
      return {
        ...state,
        curQuestion: action.payload,
      };

    case "submitQuiz": {
      const numCorrectAnswers = state.selectedAnswers.filter(
        (selectedAnswer) => selectedAnswer.answer.correct_answer
      ).length;

      return {
        ...initialState,
        currentQuiz: state.currentQuiz,
        totalScore: numCorrectAnswers * state.pointsPerQuestion,
        numCorrectAnswers,
      };
    }

    case "deleteQuiz":
      return {
        ...state,
        quizzes: state.quizzes.filter(
          (quiz) => quiz.id != action.payload.quizId
        ),
        status: "idle",
      };

    case "resetQuiz":
      return {
        ...initialState,
      };

    case "loadError":
      return {
        ...state,
        error: action.payload,
      };

    case "confirmAction":
      return {
        ...state,
        confirmHandler: action.payload?.handler,
        confirmData: action.payload?.quizId,
      };

    case "cancelAction":
      return {
        ...state,
        confirmData: null,
        confirmHandler: null,
      };

    case "actionError":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

function QuizzesProvider({ children }) {
  const [
    {
      status,
      error,
      timer,
      quizzes,
      currentQuiz,
      curQuestion,
      confirmData,
      selectedAnswers,
      totalScore,
      numCorrectAnswers,
      confirmHandler,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function getUserQuizzes(userId) {
    dispatch({ type: "dataLoading" });
    try {
      if (userId === null) return;

      const { data, error } = await fetchQuizzes(userId);

      if (error) throw error;

      dispatch({ type: "dataLoaded", payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: "actionError", payload: error });
    }
  }

  async function handleDeleteQuiz(quizId) {
    try {
      const res = await deleteQuiz(quizId);

      dispatch({ type: "deleteQuiz", payload: quizId });
      return res;
    } catch (error) {
      console.error(error);
      dispatch({ type: "actionError", payload: error });
      throw error;
    }
  }

  return (
    <QuizzesContext.Provider
      value={{
        status,
        error,
        timer,
        quizzes,
        getUserQuizzes,
        currentQuiz,
        curQuestion,
        confirmData,
        selectedAnswers,
        totalScore,
        numCorrectAnswers,
        confirmHandler,
        handleDeleteQuiz,
        dispatch,
      }}>
      {children}
    </QuizzesContext.Provider>
  );
}

function useQuizzes() {
    const context = useContext(QuizzesContext)

    if (context === undefined) throw new Error('Tentou acessar o Context fora do Provider')

    return context
}


export {
    QuizzesProvider, useQuizzes
}