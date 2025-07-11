import { useCallback, useEffect, useState } from "react";
import { useBuilder } from "../contexts/BuilderContext"

export function useAutoSaveQuiz(quizId = null, quizData, onRestore, status) {
  const [draft, setDraft] = useState(null)
  const isOnline = navigator.onLine;

  // Last synced date
  const quizKey = `quiz_draft_${quizId}`;

  const { draftStatus, hasRestored, lastSynced, handleUpdateQuiz, dispatch } = useBuilder();

  useEffect(() => {
    if (!(status === 'ready') || hasRestored || quizId === null) return 

    const savedDraft = localStorage.getItem(quizKey);

    if (savedDraft) {
        try  {
            const parsed = JSON.parse(savedDraft);
            onRestore(parsed);
            setDraft(parsed)
            dispatch({
              type: "saveDraft",
              payload: isOnline ? "Saving" : "Offline",
            });
        } catch(error) {

            console.error("Erro ao converter rascunho")
        }
    } 
  }, [quizKey, status, hasRestored]);


  useEffect(() => {
    if ( !(status === 'ready') || !hasRestored || quizId === null) return 
    
    localStorage.setItem(quizKey, JSON.stringify(quizData));
    setDraft(quizData)

    dispatch({type: "saveDraft", payload: isOnline ? "Saving": "Offline"})
    
  }, [quizData, status, hasRestored, quizId]);


  // Sync to Supabase
  useEffect(() => {
    if (!(status === 'ready') || !hasRestored || !draft || !isOnline) return
   
      const timeout = setTimeout(async () => {
        console.log(draftStatus, quizId)

        await handleUpdateQuiz(draft)

        dispatch({
          type: "saveDraft", payload: "Saved" 
        });
          
      }, 1000)

    return () => clearTimeout(timeout)

  }, [draft, status]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(quizKey);
  }, [quizKey]);

  return {draftStatus, lastSynced}
} 