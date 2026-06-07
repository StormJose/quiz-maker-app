import { useEffect, useRef, useState } from "react";
import { useBeforeUnload, useBlocker } from "react-router";
import UnsavedChangesDialog from "@/ui/unsaved-changes-dialog";
import { Quiz } from "@/types/quiz";

export function useUnsavedChanges(currentQuiz: Quiz, status: string) {
  const [showDialog, setShowDialog] = useState(false);
  const nextPathRef = useRef<string | null>(null);

  const settings = {
    shuffle: currentQuiz.shuffle,
    customScore: currentQuiz.customScore,
  };

  const [initialSettings, setInitialSettings] = useState(
    status === "ready" ? settings : {},
  );

  const dirty = JSON.stringify(initialSettings) !== JSON.stringify(settings);

  useBeforeUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const blocker = useBlocker(({currentLocation, nextLocation, historyAction}) => dirty && currentLocation.pathname !== nextLocation.pathname);

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