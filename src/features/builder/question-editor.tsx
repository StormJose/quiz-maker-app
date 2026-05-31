import { useEffect, useState } from "react";
import Answers from "./Answers";
import { useBuilder } from "@/store/builderStore";

// ─── Question Editor (stub) ───────────────────────────────────────────────────
export function QuestionEditor() {

  const { currentQuiz, curQuestion, updateQuestion} = useBuilder();

  const [description, setDescription] = useState<string>(curQuestion?.description ?? "")
  const [pointsRewarded, setPointsRewarded] = useState(
    curQuestion?.pointsRewarded,
  );

    useEffect(() => {
      setDescription(curQuestion?.description ?? "");
      setPointsRewarded(curQuestion?.pointsRewarded);
    }, [curQuestion]);


  function handleChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target?.value);
  }

  function handleConfirmDescription() {
    if (!curQuestion) return;
    const updatedQuestion = {
      ...curQuestion,
      description,
    };

    updateQuestion(updatedQuestion);
  }

  function handleChangePoints(e:  React.ChangeEvent<HTMLInputElement>) {

    if (!e.target) return

    const raw = e.target.value
    setPointsRewarded(raw === ""  ? undefined : Number(raw));
  }

  function handleConfirmPoints() {
    if (!curQuestion) return;
    const updatedQuestion = {
      ...curQuestion,
      pointsRewarded: Number(pointsRewarded),
    };

    updateQuestion(updatedQuestion);
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
          name={`${curQuestion.questionId}-${curQuestion.order}`}
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
