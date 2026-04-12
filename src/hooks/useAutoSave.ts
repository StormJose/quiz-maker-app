import { useEffect, useState, useRef, useCallback } from "react";

const areEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function useAutoSaveQuiz(quizData = {}, onRestore, status, persist, handleInsertQuiz, onSaveDraft) {
  const [draft, setDraft] = useState(null);
  const [hasRestored, setHasRestored] = useState(false);
  const isOnline = navigator.onLine;
  const lastSyncedRef = useRef(null);
  const hasSyncedRef = useRef(false);
  
  const quizKey = `quiz_draft_${quizData?.quizId}`;
  const savedDraft = localStorage.getItem(quizKey);
  useEffect(() => {
    if (status !== "ready" || hasRestored) return;

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      onRestore(parsed);
      setDraft(parsed);
      setHasRestored(true);

      onSaveDraft(isOnline)
    } else {
      console.log("Nenhum draft encontrado, inicializando um novo...");
    }
  }, [quizKey, status, hasRestored]);

  /////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "ready" || (!hasRestored && areEqual(quizData, draft)))
      return;

    const timeout = setTimeout(async () => {
        const newDraftString = JSON.stringify(quizData);
        localStorage.setItem(quizKey, newDraftString);
   
    }, 1000);
  
    setDraft(quizData);
    onSaveDraft(isOnline ? "Saving": "Offline");
    setHasRestored(true);
    return () => clearTimeout(timeout);
    
  }, [quizData, hasRestored]);

  ///////////////////////////////////////////////////
  useEffect(() => {    
    if (status !== "ready" || !draft || !hasRestored || !isOnline) return;

    if (areEqual(draft, JSON.parse(lastSyncedRef.current || "{}"))) return;

    const timeout = setTimeout(async () => {
      try {
        if (draft.quizId && persist) {

          await handleInsertQuiz(draft);
          lastSyncedRef.current = JSON.stringify(draft);
        }
      } catch (error) {
        console.error("Erro ao salvar draft remotamente:", error);
        onSaveDraft(isOnline ? "Saved": "Offline");
      } finally {
        onSaveDraft("Saved")
      }
    }, 1000);

    if (quizKey.includes("tempo")) localStorage.removeItem(quizKey);
    return () => clearTimeout(timeout);
   
  }, [draft, status, hasRestored, isOnline]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(quizKey);
  }, [quizKey]);
  return {
    clearDraft,
  };
}