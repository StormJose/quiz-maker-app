import { Quiz } from "@/types/quiz";
import { useEffect, useState, useRef, useCallback } from "react";

const areEqual = (a: Quiz, b: Quiz) => JSON.stringify(a) === JSON.stringify(b);



export function useAutoSaveQuiz(quizData: Quiz, 
  onRestoreAction: (quiz: Quiz) => void, 
  status: string, 
  persist: boolean, 
  handleInsertQuiz: (quizData: Quiz) => void, 
  onSaveDraft: () => void): {
    savedDraft: string | null, 
    clearDraft: () => void} {
  const [draft, setDraft] = useState<Quiz | null>(null);
  const [hasRestored, setHasRestored] = useState(false);
  const isOnline = navigator.onLine;
  const lastSyncedRef = useRef<string| null>(null);

  const quizKey = `quiz_draft_${quizData?.quizId}`;
  const savedDraft = localStorage.getItem(quizKey);
  useEffect(() => {
    if (status !== "ready" || hasRestored) return;

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      onRestoreAction(parsed);
      setDraft(parsed); 
      onSaveDraft();
      setHasRestored(true);
    } else {
      console.log("Nenhum draft encontrado, inicializando um novo...");
      setHasRestored(true);
    }
  }, [quizKey, status, hasRestored]);

  /////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "ready" || !hasRestored) return;

    const timeout = setTimeout(async () => {
        const newDraftString = JSON.stringify(quizData);
        localStorage.setItem(quizKey, newDraftString);
   
    }, 1000);
  
    setDraft(quizData);
    onSaveDraft();
    setHasRestored(true);
    return () => clearTimeout(timeout);
    
  }, [quizData, hasRestored]);

  ///////////////////////////////////////////////////
  useEffect(() => {    
    if (status !== "ready" || !draft || !hasRestored || !isOnline) return;
    console.log(status, draft, hasRestored, isOnline )
    if (areEqual(draft, JSON.parse(lastSyncedRef.current || "{}"))) return;
    console.log(draft, lastSyncedRef)
    console.log("status: ",status)
    const timeout = setTimeout(async () => {
      try {
        if (draft?.quizId && persist) {

          await handleInsertQuiz(draft);
          lastSyncedRef.current = JSON.stringify(draft);
        }
      } catch (error) {
        console.error("Erro ao salvar draft remotamente:", error);
        onSaveDraft();
      } finally {
        onSaveDraft();
      }
    }, 1000);

    if (quizKey.includes("tempo")) localStorage.removeItem(quizKey);
    return () => clearTimeout(timeout);
   
  }, [draft, status, hasRestored, isOnline]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(quizKey);
  }, [quizKey]);
  return {
    savedDraft,
    clearDraft,
  };
}