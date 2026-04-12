import Button from "./Button";
import {
  Dialog,DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";


export default function UnsavedChangesDialog({open, onHandleStay, onHandleLeave}) {

  console.log(open)
  return (
    <Dialog open={open}>
      <DialogOverlay />
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Tem certeza?</DialogTitle>
          <DialogDescription>
            Você tem alterações não salvas. Deseja realmente sair?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center items-center gap-2">
          <Button styles={"standard"} onClick={onHandleStay} additionalStyles={"px-4 py-1.5"}>
            Cancelar
          </Button>
          <Button onClick={onHandleLeave} additionalStyles={"px-4 py-1.5"}>Sair</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
