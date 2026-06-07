import { useQuizzes } from "@/store/quizzesStore";
import WarningDialog from "@/ui/Dialog";
import { useBeforeUnload, useBlocker } from "react-router";



export function useWarningDialog() {
  const { closeDialog, showDialog, dialogLabel, dialogMessage, confirmHandler } =
  useQuizzes();

  useBeforeUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const blocker = useBlocker(
    ({ currentLocation, nextLocation, historyAction }) =>
      showDialog && currentLocation.pathname !== nextLocation.pathname
  );

  function onHandleClose() {
    closeDialog();

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