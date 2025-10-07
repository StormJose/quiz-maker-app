import { useEffect, useState, useRef, useCallback } from "react";
import { useBuilder } from "../contexts/BuilderContext";

const areEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function useAutoSaveQuiz(quizId = null, quizData, onRestore, status) {
  const [draft, setDraft] = useState(null);
  const [hasRestored, setHasRestored] = useState(false);
  const isOnline = navigator.onLine;
  const lastSyncedRef = useRef(null);
  const hasSyncedRef = useRef(false);

  const { draftStatus, lastSynced, persist, handleInsertQuiz, dispatch } =
    useBuilder();

  const quizKey = `quiz_draft_${quizData?.id}`;
  const savedDraft = localStorage.getItem(quizKey);

  useEffect(() => {
    if (status !== "ready" || hasRestored) return;

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      onRestore(parsed);
      setDraft(parsed);
      setHasRestored(true);

      dispatch({
        type: "saveDraft",
        payload: isOnline ? "Saving" : "Offline",
      });
    } else {
      console.log("Nenhum draft encontrado, inicializando um novo...");
    }
  }, [quizKey, status, hasRestored]);

  /////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "ready" || (!hasRestored && areEqual(quizData, draft)))
      return;

    const timeout = setTimeout(async () => {
      try {
        const newDraftString = JSON.stringify(quizData);
        localStorage.setItem(quizKey, newDraftString);
      } catch (error) {
        throw error;
      }
    }, 1000);

    setDraft(quizData);
    dispatch({
      type: "saveDraft",
      payload: isOnline ? "Saving" : "Offline",
    });
    setHasRestored(true);

    return () => clearTimeout(timeout);
  }, [quizData, status, hasRestored, draft]);

  ///////////////////////////////////////////////////
  useEffect(() => {
    if (status !== "ready" || !draft || !hasRestored || !isOnline) return;

    if (areEqual(draft, JSON.parse(lastSyncedRef.current || "{}"))) return;

    const timeout = setTimeout(async () => {
      try {
        if (draft.id && persist) {
          await handleInsertQuiz(draft);
          lastSyncedRef.current = JSON.stringify(draft);
        }
      } catch (error) {
        console.error("Erro ao salvar draft remotamente:", error);
        dispatch({ type: "saveDraft", payload: "Offline" });
      } finally {
        dispatch({ type: "saveDraft", payload: "Saved" });
      }
    }, 1000);

    if (quizKey.includes("tempo")) localStorage.removeItem(quizKey);
    return () => clearTimeout(timeout);
  }, [draft, status, hasRestored, isOnline]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(quizKey);
  }, [quizKey]);
  return {
    draftStatus,
    lastSynced,
    clearDraft,
  };
}