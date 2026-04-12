import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Copy,
  Trash2,
  CheckSquare,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/contexts/BuilderContext";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave.ts"
import { useLocation, useNavigate } from "react-router";
import { useQuizzes } from "@/contexts/QuizzesContext.tsx";
import Answers from "./Answers.tsx";
import toast, { Toaster } from "react-hot-toast";
import { feedback } from "@/utils/toast-utils.ts";
import BuilderSkeleton from "@/skeletons/BuilderSkeleton.tsx";


function SortableQuestionCard({ question, isActive, onClick, isDragOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.questionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
   
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-current={isActive ? "true" : undefined}
      className={`
        group relative flex items-start gap-2 rounded-lg border px-3 py-2.5 cursor-pointer
        transition-all duration-150 select-none outline-none
        focus-visible:ring-2 focus-visible:ring-ring
        ${isDragOverlay ? "rotate-1 scale-[1.02] opacity-0 backdrop-blur-2xl" : ""}
        ${
          isActive
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border bg-card hover:border-primary/40 hover:bg-main/20"
        }
      `}>
      <button
        {...listeners}
        {...attributes}
        tabIndex={-1}
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors">
        <GripVertical size={14} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span
            className={`text-[11px] font-semibold tracking-wide uppercase ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Q{question.order}
          </span>
          <span className="text-[10px] text-muted-foreground/70 tabular-nums">
            {question.pointsRewarded}pt
            {question.pointsRewarded !== 1 ? "s" : ""}
        
          </span>
        </div>

        {/* Description preview */}
        <p className="text-xs text-foreground/80 leading-snug line-clamp-2 break-words">
          {question.description || (
            <span className="italic text-muted-foreground/50">
              Sem descrição
            </span>
          )}
        </p>
      </div>

      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
      )}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function QuestionsSidebar({
    onReorder,
}) {
  const {dispatch: builderDispatch, currentQuiz, curQuestion} = useBuilder();
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 3 },
    }),
  );

  function handleDragStart(e) {
    console.log(e)
    setActiveCard(
      currentQuiz?.questions.find((question) => question.questionId === e.active.id) ?? null,
    );
  }

  function handleDragEnd(e) {
    setActiveCard(null);
    const { active, over } = e;
      console.log(e)
    if (!over || active.id === over.id) return;
    const oldIndex = currentQuiz?.questions.findIndex((q) => q.questionId === active.id);
    const newIndex = currentQuiz?.questions.findIndex((q) => q.questionId === over.id);
    if (oldIndex !== newIndex)
      onReorder(arrayMove(currentQuiz?.questions, oldIndex, newIndex));
  }

  function handleSelectQuestion(question) {
    builderDispatch({type: "setCurQuestion", payload: question})
  }

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <h3 className="text-md font-semibold text-foreground">Perguntas</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {currentQuiz?.questions.length}
        </span>
      </div>

      {/* Scrollable question list */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={currentQuiz?.questions.map(
              (question) => question.questionId,
            )}
            strategy={verticalListSortingStrategy}>
              
            {currentQuiz?.questions.map((question) => (
              <SortableQuestionCard
                key={question.questionId}
                question={question}
                isActive={question.questionId === curQuestion.questionId}
                onClick={() => handleSelectQuestion(question)}
              />
            ))}
          </SortableContext>
          
          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeCard ? (
              <SortableQuestionCard
                question={activeCard}
                isActive={false}
                isDragOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </aside>
  );
}

// ─── Question Editor (stub) ───────────────────────────────────────────────────
function QuestionEditor() {

  const {currentQuiz, dispatch: builderDispatch, curQuestion} = useBuilder();

  const [description, setDescription] = useState(curQuestion?.description)
  const [pointsRewarded, setPointsRewarded] = useState(
    curQuestion?.pointsRewarded,
  );

    useEffect(() => {
      setDescription(curQuestion?.description);
      setPointsRewarded(curQuestion?.pointsRewarded);
    }, [curQuestion]);


  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleConfirmDescription() {
    const updatedQuestion = {
      ...curQuestion,
      description,
    };
    builderDispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  function handleChangePoints(e: InputEvent) {

    if (!e.target) return

    setPointsRewarded(e.target.value);
  }

  function handleConfirmPoints() {
    const updatedQuestion = {
      ...curQuestion,
      pointsRewarded: Number(pointsRewarded),
    };

    builderDispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  if (!curQuestion)
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Selecione uma questão para editar
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-8 max-w-2xl mx-auto w-full">
      
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Pergunta {curQuestion.order}
        </span>
        <span className="text-xs border border-main text-main rounded uppercase bg-main/25 px-1.5 py-0.5 font-semibold">
          {curQuestion.type === "multiple_choice" ? "Múltipla Escolha" : "Verdadeiro / falso"}
        </span>
      </div>

      <textarea
        name={`#${curQuestion.questionId}-${curQuestion.order}`}
        className="w-full min-h-[100px] resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          transition-shadow"
        placeholder="O conteúdo da sua pergunta vai aqui..."
        value={description ?? ''}
        onBlur={() => handleConfirmDescription()}
        onChange={(e) => handleChangeDescription(e)}
      />

{!currentQuiz.customScore &&
      <div className="mt-4 flex items-center gap-2">
        <label className="text-xs text-muted-foreground font-medium">
          Points
        </label>
        <input
          type="text"
          name={`${curQuestion.id}-${curQuestion.order}`}
          min={1}
          max={50}
          maxLength={2}
          value={pointsRewarded ?? 0}
          onChange={(e) =>
            handleChangePoints(e)
          }
          onBlur={() => handleConfirmPoints()}
          
          className="w-16 h-8 rounded-md border border-input bg-background px-2 text-sm text-center
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
      </div>

        }
      {/* Answers placeholder */}
      <div className="mt-8 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <Answers/>
         
      </div>
    </div>
  );
}

// -- Question Toolbox -- //

export function QuestionToolbox () {

    const {dispatch: builderDispatch, handleDeleteQuestion, curQuestion, currentQuiz} = useBuilder();

      function handleAddQuestion() {
        builderDispatch({ type: "addQuestion" });
      }

      function handleAddTrueOrFalseQuestion() {
        builderDispatch({ type: "addTrueOrFalseQuestion" });
      }

      function handleClone() {
        builderDispatch({ type: "cloneQuestion" });
      }

      async function handleDelete() {
        try {
          await handleDeleteQuestion(curQuestion.questionId);
          toast.success("Pergunta excluída");
        } catch (error) {
          feedback.error("Erro ao excluir pergunta ");
        }
      }

    const canDelete = currentQuiz?.questions?.length > 1;
    return (
      <div className="flex items-center gap-1 border-t border-border px-3 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className=" justify-start gap-2 text-xs font-medium hover:bg-tint border-[1.55px] border-tint"
          onClick={() => handleAddQuestion()}>
          <List size={13} />
          Múltipla escolha
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className=" justify-start gap-2 text-xs font-medium hover:bg-tint border-[1.55px] border-tint"
          onClick={() => handleAddTrueOrFalseQuestion()}>
          <CheckSquare size={13} />
          Verdadeiro ou falso
        </Button>

        <div className="flex gap-1 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1 gap-1.5 text-xs hover:big-tint"
            onClick={handleClone}>
            <Copy size={12} />
            Clonar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canDelete}
            className="flex-1 gap-1.5 text-xs text-destructive hover:text-destructive hover:border-destructive/50 hover:bg-destructive/20 disabled:opacity-40"
            onClick={handleDelete}>
            <Trash2 size={12} />
            Excluir
          </Button>
        </div>
      </div>
    );
}

// ─── Root Builder ─────────────────────────────────────────────────────────────
export default function NewBuilder() {
  const navigate = useNavigate();
  const location = useLocation();

  // const { quizzesData, numDrafts } = useRouteLoaderData("edit-quiz");
  const { dispatch: quizzesDispatch } = useQuizzes();

  const {
    status,
    persist,
    currentQuiz,    
    curQuestion,
    handleInsertQuiz,
    dispatch: builderDispatch,
  } = useBuilder();

  const onRestoreAction = (quiz): object => builderDispatch({ type: "setCurrentQuiz", payload: quiz });
  const onSaveDraftAction = (status): string => builderDispatch({type: "setSaveDraft", payload: status})
  const { draftStatus, savedDraft } = useAutoSaveQuiz(
    currentQuiz,
    onRestoreAction,
    status,
    persist,
    handleInsertQuiz,
    onSaveDraftAction,
  );

  const [quizTitle, setQuizTitle] = useState(currentQuiz?.title)


  function handleTitleChange(e) {
    setQuizTitle(e.target.value)
  }

  function handleTitleBlur() {
    builderDispatch({type: "setTitle", payload: quizTitle})
  }

  function handleReorder(newOrder) {
    builderDispatch({type: "reorderQuestions", payload: newOrder});
  }

  function handleGoBack() {
    navigate("/");
  }

  return (
    <div className="flex flex-col h-screen bg-background">
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
          onReorder={handleReorder}
      
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

