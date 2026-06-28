import { createContext, useCallback, useContext, useReducer } from "react";
import { BlockerFunction, useBeforeUnload, useBlocker } from "react-router";


type DialogState = {
  showDialog: boolean;
  dialogLabel: string;
  dialogMessage: string;
  handler?: (...args: string[]) => Promise<unknown>;
  data: string | null
};

export type DialogAction =
  | { type: 'openDialog', 
      payload: { 
        dialogMessage: string,
        dialogLabel: string,
      } 
    }
  | { type: 'closeDialog' }
  | {type: 'confirmAction', payload: {
    dialogLabel: string,
    dialogMessage: string,
    handler?: (...args: string[]) => Promise<unknown>,
    data: string
  }}


export type Blocker = {
  state: "unblocked" | "blocked" | "proceeding";
  location: string;
  proceed: () => void;
  reset: () => void;
}

  const initialState: DialogState = {
    showDialog: false,
    dialogLabel: "",
    dialogMessage: "",
    data:  null
  }


const WarningDialogContext = createContext<ReturnType<typeof useWarningDialogInternal> | null>(null);

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    
    case 'openDialog':
      return { ...state, showDialog: true, dialogLabel: action.payload.dialogLabel, dialogMessage: action.payload.dialogMessage };
    case 'closeDialog':
      return { ...initialState};
    case 'confirmAction': 
      return {...state, dialogLabel: action.payload.dialogLabel, dialogMessage: action.payload.dialogMessage,  handler: action.payload.handler, data: action.payload.data}
    default:
      return state;
  }
}

function useWarningDialogInternal() {
  const [{ showDialog, dialogLabel, dialogMessage, handler, data }, dispatch] =
    useReducer(dialogReducer, initialState);

  useBeforeUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      showDialog && currentLocation.pathname !== nextLocation.pathname,
    [showDialog]
  );
  const blocker = useBlocker(shouldBlock);
  return { showDialog, dialogLabel, dialogMessage, handler, data, blocker, dispatch };
}

export function WarningDialogProvider({ children }: { children: React.ReactNode }) {
  const value = useWarningDialogInternal();
  return (
    <WarningDialogContext.Provider value={value}>
      {children}
    </WarningDialogContext.Provider>
  );
}

export function useWarningDialog() {
  const ctx = useContext(WarningDialogContext);
  if (!ctx) throw new Error("useWarningDialog must be used inside WarningDialogProvider");
  return ctx;
}