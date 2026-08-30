import { useState } from "react";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave.ts"
import { Toaster } from "react-hot-toast";
import { useBuilder } from "@/store/builderStore.ts";
import { Quiz } from "@/types/quiz.ts";
import { QuestionsSidebar } from "./questions-sidebar.tsx";
import { QuestionEditor } from "./question-editor.tsx";
import { QuestionToolbox } from "./question-toolbox.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import FloatingMenu from "@/ui/menus/floating-menu.tsx";


export default function NewBuilder() {
  const {
    status,
    persist,
    currentQuiz,   
    numQuizzes, 
    setCurrentQuiz,
    handleInsertQuiz,
    setTitle,
    saveDraft
  } = useBuilder();

  const onRestoreAction = (quiz?: Quiz): void => setCurrentQuiz(quiz, numQuizzes)
  const onSaveDraftAction = (status?: any): void => saveDraft(status)
  const { savedDraft } = useAutoSaveQuiz(
    currentQuiz,
    onRestoreAction,
    status,
    persist,
    handleInsertQuiz,
    onSaveDraftAction,
  );

  const [quizTitle, setQuizTitle] = useState(currentQuiz?.title)


  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuizTitle(e.target.value)
  }

  function handleTitleBlur() {
    setTitle(quizTitle)
  }
  
  
  return (
    <div className="flex flex-col h-screen bg-background relative">

 
      {/* Top bar */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-border bg-card shrink-0">
        <input
          className="text-sm font-semibold bg-transparent border-none outline-none focus-visible:ring-0
            text-foreground placeholder:text-muted-foreground w-64"
          value={quizTitle}
          onChange={(e) => handleTitleChange(e)}
          onBlur={() => handleTitleBlur()}
          placeholder="Adicione um título"
        />
        <span className="ml-auto text-xs text-muted-foreground">
          {currentQuiz?.questions.length} question
          {currentQuiz?.questions.length !== 1 ? "s" : ""}
        </span>
      </header>

      {/* Body: sidebar + editor */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionsSidebar      
        />
        <div className="flex-1 overflow-y-auto">
          <QuestionToolbox /> 
          <QuestionEditor
          />
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
  
}

