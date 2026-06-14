import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useWarningDialog } from "@/hooks/useWarningDialog";


export default function WarningDialog() {

  const {showDialog, dialogLabel, dialogMessage, dispatch, blocker} = useWarningDialog()
  console.log("showDialog: ", showDialog)
  const navigate = useNavigate();
  function onHandleDismiss() {
    dispatch({type: "closeDialog"})
  }

  function onHandleClose() {
      dispatch({type: "closeDialog"})
      navigate(-1);
  
  }
  console.log(blocker)
  console.log("showDialog: ", showDialog)
  return (
    <Dialog open={showDialog}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">{dialogLabel ?? "Aviso"}</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button intent={"standard"} onClick={onHandleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
