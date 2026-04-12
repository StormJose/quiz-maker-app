import { useState } from "react";
import Button from "./Button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuizzes } from "@/contexts/QuizzesContext";

export default function WarningDialog({open, dialogLabel, dialogMessage, onDismiss, onClose}) {
 
  const {dispatch} = useQuizzes()

  function onHandleDismiss() {
    dispatch({type: "setDialogClose"})
    onDismiss()
  }

  function onHandleClose() {
    dispatch({ type: "setDialogClose" });
    onClose()
  }

  return (
    <Dialog open={open}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">{dialogLabel ?? "Aviso"}</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button styles={"standard"} additionalStyles={"py-1.5 px-4"} onClick={onHandleClose}>
            Voltar
          </Button>
          {/* <Button onClick={onHandleDismiss}>Ignorar</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
