import { useEffect, useRef, useState } from "react";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router";
import { useBuilder } from "../store/builderStore";
import UnsavedChangesDialog from "@/ui/unsaved-changes-dialog";

export function useUnsavedChanges() {
  const navigate = useNavigate();

  const { status, currentQuiz } = useBuilder()
  const [showDialog, setShowDialog] = useState(false);
  // Only load actual initialState when it is ready
  const [initialSettings, setInitialSettings] = useState(status === 'ready' ? currentQuiz?.settings : {});
  const nextPathRef = useRef(null);

  
  const dirty = JSON.stringify(initialSettings) !== JSON.stringify(currentQuiz?.settings)

  console.log(dirty)
  useBeforeUnload((e) => {

    e.preventDefault();
    e.returnValue = "";
  
  }
  );

  const blocker = useBlocker(({currentLocation, nextLocation, historyAction}) => dirty && currentLocation.pathname !== nextLocation.pathname);

  console.log(blocker)
  
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
    console.log(nextPathRef.current)
    setShowDialog(false);
    if (nextPathRef.current) {
      blocker.proceed()      
    
    }
    
  };

  const handleUpdateSettings = (settings) => setInitialSettings(settings)

  const Dialog = <UnsavedChangesDialog open={showDialog} onHandleStay={handleStay} onHandleLeave={handleLeave} />;

  return { Dialog, dirty, handleUpdateSettings };
}