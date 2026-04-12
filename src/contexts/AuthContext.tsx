import { getCurrentUser, getUserData, signInWithEmail, signOutUser, signUpNewUser } from "@/auth/auth";
import { toMessage } from "@/lib/errors";
import { Action, InitialState } from "@/types/auth";
import supabase from "@/utils/supabase";
import {
  isAuthApiError,
  isAuthSessionMissingError,
} from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const AuthContext = createContext();

const initialState: InitialState = {
  status: "idle",
  error: {
    type: "",
    message: "",
  },
  currentUser: {},
};

function reducer(state: InitialState, action: Action) {
  switch (action.type) {
    case "setLoading":
      return {
        ...state,
        status: "loading",
      };
    case "getCurrentUser":
      return {
        ...state,
        currentUser: action.payload,
      };

    case "setUser":
      return {
        ...state,
        currentUser: action.payload,
        status: "ready",
      };
    case "setError":
      if (isAuthSessionMissingError(action.payload)) {
        return {
          ...state,
          status: "idle",
          error: {
            type: "SessionMissingError",
            message: "Nenhuma sessão ativa encontrada",
          },
        };
      }
      if (isAuthApiError(action.payload)) {
        return {
          ...state,
          status: "idle",
          error: {
            message: "E-mail ou Senha estão incorretos",
          },
        };
      }
      if (action.payload instanceof TypeError) {
        return {
          ...state,
          error: {
            message: "Houve um erro interno. Tente novamente mais tarde :/",
          },
        };
      } else {
        return {
          ...state,
          error: action.payload,
        };
      }

    case "resetAuth":
      return {
        ...initialState,
      };
  }
}

function AuthProvider({ children }) {
  const [{ status, error, currentUser }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    async function loadUser() {
      dispatch({ type: "setLoading" });
      try {
        const session = await getCurrentUser();

        const user = await getUserData(session?.user.id);

        if (user) dispatch({ type: "getCurrentUser", payload: user });
      } catch (error) {
        dispatch({ type: "setError", payload: toMessage(error) });
      }
    }

    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    dispatch({ type: "setLoading" });
    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) throw error;

      if (data) {
        dispatch({ type: "getCurrentUser", payload: data?.user });
      }
    } catch (error) {
      dispatch({ type: "setError", payload: toMessage(error) });
      console.error(error);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    dispatch({ type: "setLoading" });
    try {
      const { data, error } = await signUpNewUser(email, password);

      if (error) throw error;

      if (data) {
        console.log(data);
        const { data: userData, error: creationError } = await supabase
          .from("users")
          .insert([{ id: data.user.id }]);

        if (creationError)
          console.error("Erro ao criar usuário", creationError);

        dispatch({ type: "setUser", payload: userData });
      }
    } catch (error) {
      dispatch({ type: "setError", payload: toMessage(error) });
      console.error(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const error = await signOutUser();

      if (!error) {
        dispatch({ type: "resetAuth" });
      }
    } catch (error) {
      dispatch({ type: "setError", payload: toMessage(error) });
      console.error(error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        status,
        error,
        signUp,
        signIn,
        signOut,
        dispatch,
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