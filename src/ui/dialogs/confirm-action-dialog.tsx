import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWarningDialog } from "@/hooks/useWarningDialog";

export default function ConfirmAction() {
  
  const { dialogLabel, dialogMessage, handler, data, dispatch} = useWarningDialog()

  async function handleConfirmAction () {
    try {

      if (handler && data) {
        await handler(data)
        dispatch({type: "closeDialog"})
      }
    } catch(error) {
      console.error(error)
    }
  }

  function handleCancelAction() {
    dispatch({type: "closeDialog"})
  }
  const openDialog = data !== null
  return (
    <Dialog open={openDialog}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">{dialogLabel}</DialogTitle>
          <DialogDescription className="mb-8">
            {dialogMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-center gap-2 ">
          <Button intent={"standard"} className={"px-4 py-1.5"} onClick={handleConfirmAction}>
            Confirmar
          </Button>
          <Button intent={"alternate"} className={"px-4 py-1.5"} onClick={handleCancelAction}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
