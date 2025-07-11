import { createContext, useContext, useEffect, useReducer } from "react";
import { fetchQuizzes, deleteQuiz } from '../api/quizApi.js'

const QuizzesContext = createContext();


const initialState = {
    quizzes: [],
    currentQuiz: null,
    curQuestion: {},
    status: "idle",
    isLoading: false,
    error: null,
    timer: 0,
    pointsPerQuestion: 15,
    totalScore: 0,
    selectedAnswers: [],
    numCorrectAnswers: null,
    confirmHandler: null,
    confirmData: null

}

function reducer(state, action) {
    switch (action.type) {
      case "dataLoading":
        return {
          ...state,
          isLoading: true,
          status: "occupied",
        };

      case "dataLoaded":
        return {
          ...state,
          quizzes: action.payload,
          isLoading: false,
          status: "ready",
        };
      case "setCurrentQuiz":
        console.log(action.payload)
        return {
          ...state,
          currentQuiz: action.payload,
          curQuestion: action.payload.questions[0],
        };

      case "startQuiz":
        return {
          ...state,
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
          curQuestion: action.payload
        }

      case "submitQuiz": {
        const numCorrectAnswers = state.selectedAnswers.filter(
          (selectedAnswer) => selectedAnswer.answer.correctAnswer
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
          isLoading: true,
        };

      case "resetQuiz": 
        return {
          ...initialState
        }

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


function QuizzesProvider({children}) {

    const [
      {
        isLoading,
        error,
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

    useEffect(() => {
        async function fetchData () {
            dispatch({ type: "dataLoading" });
            try {
                const quizzes =  await fetchQuizzes();
                
                if (quizzes.error) throw Error()
                  
                dispatch({type: 'dataLoaded', payload: quizzes})

            } catch(error) {
                console.error(error)
                dispatch({type: "actionError", payload: error})
            }
        }
        fetchData()
    }, [])

    
    async function handleDeleteQuiz (quizId) {
        try {
          const res = await deleteQuiz(quizId)

          dispatch({type: "deleteQuiz", payload: quizId})
          return res
          
        } catch(error) {
            console.error(error);
            dispatch({type: "actionError", payload: error})
            throw error
        }

    }

    return (
    <QuizzesContext.Provider value={{isLoading, error, quizzes, currentQuiz, curQuestion, confirmData, selectedAnswers, totalScore, numCorrectAnswers, confirmHandler, handleDeleteQuiz,  dispatch}}>
        {children}
    </QuizzesContext.Provider>)
}

function useQuizzes() {
    const context = useContext(QuizzesContext)

    if (context === undefined) throw new Error('Tentou acessar o Context fora do Provider')

    return context
}


export {
    QuizzesProvider, useQuizzes
}