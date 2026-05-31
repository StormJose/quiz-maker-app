import { useQuizzes } from "../store/quizzesStore";
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

export default function ConfirmAction() {
  const { confirmData, confirmHandler, resetConfirmAction } = useQuizzes();
  async function handleConfirmAction() {
    await confirmHandler(confirmData);
    resetConfirmAction();
  }

  function handleCancelAction() {
    resetConfirmAction();
  }

  return (
    <Dialog open={confirmData}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Tem certeza?</DialogTitle>
          <DialogDescription className="mb-8">
            Deseja excluir Quiz {confirmData}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-center gap-2 ">
          <Button styles={"standard"} additionalStyles={"px-4 py-1.5"} onClick={handleConfirmAction}>
            Confirmar
          </Button>
          <Button styles={"alternate"} additionalStyles={"px-4 py-1.5"} onClick={handleCancelAction}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
