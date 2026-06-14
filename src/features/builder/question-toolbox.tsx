import { Button } from "@/components/ui/button";
import { useBuilder } from "@/store/builderStore";
import { feedback } from "@/utils/toast-utils";
import { CheckSquare, Copy, List, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function QuestionToolbox () {

    const { curQuestion, currentQuiz, addQuestion, addTrueOrFalseQuestion, cloneQuestion, handleDeleteQuestion, } = useBuilder();

      function handleAddQuestion() {
       addQuestion()
      }

      function handleAddTrueOrFalseQuestion() {
        addTrueOrFalseQuestion()
      }

      function handleClone() {
        cloneQuestion()
      }

      async function handleDelete() {
        try {
          if (curQuestion) {
            await handleDeleteQuestion(curQuestion?.questionId);
            toast.success("Pergunta excluída");
          }
        } catch (error) {
          feedback.error("Erro ao excluir pergunta ");
        }
      }

    const canDelete = currentQuiz?.questions?.length > 1;
    return (
      <div className="flex items-center gap-1 border-t border-border px-3 py-3">
        <Button
          type="button"
          intent="alternate"
          size="sm"
          className=" justify-start gap-2 text-xs font-medium hover:bg-tint border-[1.55px] border-tint"
          onClick={() => handleAddQuestion()}>
          <List size={13} />
          Múltipla escolha
        </Button>
        <Button
          type="button"
          intent="alternate"
          size="sm"
          className=" justify-start gap-2 text-xs font-medium hover:bg-tint border-[1.55px] border-tint"
          onClick={() => handleAddTrueOrFalseQuestion()}>
          <CheckSquare size={13} />
          Verdadeiro ou falso
        </Button>

        <div className="flex gap-1 pt-1">
          <Button
            type="button"
            intent="alternate"
            size="sm"
            className="flex-1 gap-1.5 text-xs hover:big-tint"
            onClick={handleClone}>
            <Copy size={12} />
            Clonar
          </Button>
          <Button
            type="button"
            intent="alternate"
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