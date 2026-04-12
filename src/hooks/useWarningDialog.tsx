import { useQuizzes } from "@/contexts/QuizzesContext";
import WarningDialog from "@/ui/Dialog";
import { useBeforeUnload, useBlocker } from "react-router";



export function useWarningDialog() {
  const { dispatch, showDialog, dialogLabel, dialogMessage, confirmHandler } =
    useQuizzes();

  // console.log(confirmHandler, dialogMessage)

  useBeforeUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const blocker = useBlocker(
    ({ currentLocation, nextLocation, historyAction }) =>
      showDialog && currentLocation.pathname !== nextLocation.pathname
  );

  function onHandleClose() {
    dispatch({ type: "setDialogClose" });

    setTimeout(() => {
      confirmHandler?.();
    }, 0);
  }

  const Dialog = (
    <WarningDialog
      open={showDialog}
      dialogLabel={dialogLabel}
      dialogMessage={dialogMessage}
      onClose={onHandleClose}
    />
  );

  return { Dialog };
}