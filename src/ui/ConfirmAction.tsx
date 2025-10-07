import { useQuizzes } from "../contexts/QuizzesContext";
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
  const { confirmData, confirmHandler, dispatch } = useQuizzes();
  async function handleConfirmAction() {
    await confirmHandler(confirmData);
    dispatch({ type: "resetAction" });
  }

  function handleCancelAction() {
    dispatch({ type: "resetAction" });
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
        <DialogFooter>
          <Button styles={"standard"} onClick={handleConfirmAction}>
            Confirmar
          </Button>
          <Button onClick={handleCancelAction}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
