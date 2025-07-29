import { getCurrentUser, getUserData, signInWithEmail, signOutUser, signUpNewUser } from "@/auth/auth";
import supabase from "@/utils/supabase";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";



const AuthContext = createContext();

const initialState = {
 
    status: 'idle',
    error: null,
    currentUser: null,

};

function reducer(state, action) {
  switch (action.type) {

      case "setLoading": 
      return {
          ...state, 
          status: 'loading'
        }
        case "getCurrentUser": 
    
            return {
                ...state,
                currentUser: action.payload
            }
        

        case "setUser":
            return {
                ...state,
                currentUser: action.payload,
                status: 'ready'
            }
        case "setError": 
    
        return {
            ...state,
            error: action.payload
        }

    case "resetAuth":
        return {
            ...initialState
        }

  }
}

function AuthProvider({ children }) {
  
    const [{status, error, currentUser}, dispatch] = useReducer(reducer, initialState)
  
    
    useEffect(() => {
        async function loadUser() {
            dispatch({type: "setLoading"})
            try {
                const session = await getCurrentUser()

                if (!session) throw Error

                const user = await getUserData(session?.user.id)
                    
                if (user) dispatch({type: "getCurrentUser", payload: user})
                
            } catch(error) {
                dispatch({type: "setError", payload: error})
            }
        }

        loadUser()
    }, [])

    const signIn = useCallback(async (email, password) => {

        dispatch({type: "setLoading"})
        try {
            const { data, error } = await  signInWithEmail(email, password)
        

            return data
        } catch(error) {

            dispatch({type: "setError", payload: error})
            console.error(error)
        }
    
    }, [])

    const signUp = useCallback(async (email, password ) => {
        dispatch({type: "setLoading"});
        try {
            const {data, error} = await signUpNewUser(email, password);

            if (error) throw new Error(error)

                console.log(data)
            if (data) {

                console.log(data)
                const {data: userData, error: creationError} = await supabase.from('users').insert([{id: data.user.id}])

                if (creationError) console.error('Erro ao criar usuário', creationError)
    
                dispatch({type: "setUser", payload: userData})
            } 
        } catch(error) {
            console.error(error)
        }
    })

    const signOut = useCallback(async () => {
        try {
            await signOutUser()

            dispatch({type: "logout"})
        } catch(error) {
            dispatch({type: 'setError', payload: error?.message})
            console.error(error)
        }
    }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        status, 
        error,
        signUp,
        signIn,
        signOut,
        dispatch
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) throw new Error('Tentou acessar o Context fora do Provider')

    return context
}


export {
    AuthProvider, useAuth
}