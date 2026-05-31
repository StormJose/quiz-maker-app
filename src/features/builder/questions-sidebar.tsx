import { useBuilder } from "@/store/builderStore";
import { Question } from "@/types/questions";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { useState } from "react";

interface SortableQuestionCardTypes {
    question: Question;
    isActive: boolean;
    onClick: () => void;
    isDragOverlay?: () => void;
}

function SortableQuestionCard({ question, isActive, onClick, isDragOverlay }: SortableQuestionCardTypes) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: question.questionId });

  const style = {
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

export function QuestionsSidebar() {
  const {currentQuiz, setCurQuestion, reorderQuestions, curQuestion} = useBuilder();
  const [activeCard, setActiveCard] = useState<Question | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 3 },
    }),
  );

  function handleDragStart(e: DragStartEvent ) {
    console.log(e)
    setActiveCard(
      currentQuiz?.questions.find((question) => question.questionId === e.active.id) ?? null,
    );
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = e;
      console.log(e)
    if (!over || active.id === over.id) return;
    const oldIndex = currentQuiz?.questions.findIndex((q) => q.questionId === active.id);
    const newIndex = currentQuiz?.questions.findIndex((q) => q.questionId === over.id);
    if (oldIndex !== newIndex)
      reorderQuestions(arrayMove(currentQuiz?.questions, oldIndex, newIndex));
  }

  function handleSelectQuestion(question: Question) {
    setCurQuestion(question)
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
                isDragOverlay={() => {}}
                key={question.questionId}
                question={question}
                isActive={question.questionId === curQuestion?.questionId}
                onClick={() => handleSelectQuestion(question)}
              />
            ))}
          </SortableContext>
          
          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeCard ? (
              <SortableQuestionCard
              onClick={() => {}}
                question={activeCard}
                isActive={false}
                isDragOverlay={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </aside>
  );
}