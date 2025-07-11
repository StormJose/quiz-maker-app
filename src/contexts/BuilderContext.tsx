import { createContext, useContext, useReducer } from "react";
import { fetchQuiz, addQuiz, updateQuiz } from '../api/quizApi.js'

const BuilderContext = createContext();

const initialState = {
  isLoading: false,
  status: "pending",
  // "Saving" | "Saved" | "Offline">
  draftStatus: "Saving",
  hasRestored: false,
  lastSynced: null,
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
            content: "Essa é sua primeira resposta",
            correctAnswer: true,
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
        status: 'ready'
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
        curQuestion: action.payload.questions[0],
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
    case "addQuestion":
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state.currentQuiz?.questions, action.payload],
        },
      };
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

    case "saveChanges": 
    return {
      ...state,
      currentQuiz: action.payload
    }
    
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
        draftStatus: action.payload,
        hasRestored: true,
        lastSynced: new Date().toLocaleString()
      }


    case "resetBuilder":
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

function BuilderProvider({children}) {

    const [{isLoading, status, draftStatus, hasRestored, lastSynced, currentQuiz, questions, curQuestion, title }, dispatch] = useReducer(reducer, initialState)
    
      async function handleGetQuiz(quizId) {
        dispatch({ type: "dataLoading" });
        try {
          const currentQuiz = await fetchQuiz(quizId);

          return currentQuiz[0];
        } catch (error) {
          console.error(error);
          dispatch({ type: "loadError", payload: error });
        } finally {
          dispatch({ type: "dataLoaded" });
        }
      }

    async function handleSaveQuiz(quiz) {
      dispatch({type: "dataLoading"})
      try {
        const res = await addQuiz(quiz);

        if (!res.ok) throw new Error("Erro ao salvar o quiz ;")
      } catch(error) {
        console.error(error)
        throw error
      } finally {
        dispatch({type: "saveQuiz"})
        
      } 
    }

    async function handleUpdateQuiz(quiz) {
      dispatch({type: "dataLoading"})
      try {
        const result = await updateQuiz(quiz);


        console.log(result)
      } catch(error) {
        console.error(error)
        throw error
      } finally {
        // dispatch({type: "saveQuiz"})
      }
    }

    return (
    <BuilderContext.Provider value={{isLoading, status, draftStatus, hasRestored, lastSynced, currentQuiz, questions, curQuestion, title, handleGetQuiz, handleSaveQuiz, handleUpdateQuiz, dispatch}}>
        {children}
    </BuilderContext.Provider>)
}

function useBuilder() {
    const context = useContext(BuilderContext)

    if (context === undefined) throw new Error('Tentou acessar o Context fora do Provider')

    return context
}


export {
    BuilderProvider, useBuilder
}