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
        <DialogFooter>
          <Button styles={"standard"} onClick={onHandleStay}>
            Cancelar
          </Button>
          <Button onClick={onHandleLeave}>Sair</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
