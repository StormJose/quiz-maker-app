import { useEffect, useRef, useState } from "react";
import { useBeforeUnload, useBlocker } from "react-router";
import UnsavedChangesDialog from "@/ui/unsaved-changes-dialog";

export function useUnsavedChanges<T extends object>(data: T, status: string) {
  const [showDialog, setShowDialog] = useState(false);
  const nextPathRef = useRef<string | null>(null);


  const [initialSettings, setInitialSettings] = useState<T | object>(
    status === "ready" ? data : {},
  );

  const dirty = JSON.stringify(initialSettings) !== JSON.stringify(data);

  useBeforeUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const blocker = useBlocker(({currentLocation, nextLocation}) => dirty && currentLocation.pathname !== nextLocation.pathname);

  useEffect(() => {

    if (blocker.state === "blocked") {
      setShowDialog(true)
      nextPathRef.current = blocker.location.pathname
    } 
    else return
  }, [blocker])

  const handleStay = () => {
    setShowDialog(false);
    nextPathRef.current = null;
  };

  const handleLeave = () => {
    setShowDialog(false);
    if (nextPathRef.current) {
      if (blocker.proceed) {

        blocker.proceed()    
      }
    
    }
    
  };

  const handleUpdateSettings = (settings: object) => setInitialSettings(settings)

  const Dialog = <UnsavedChangesDialog open={showDialog} onHandleStay={handleStay} onHandleLeave={handleLeave} />;

  return { Dialog, dirty, handleUpdateSettings };
}