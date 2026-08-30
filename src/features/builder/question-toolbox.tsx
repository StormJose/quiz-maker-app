import { deleteQuestion } from "@/api/supabaseApi";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/store/builderStore";
import { feedback } from "@/utils/toast-utils";
import { CheckSquare, Copy, List, Trash2 } from "lucide-react";
import { ReactElement } from "react";
import toast from "react-hot-toast";

export function QuestionToolbox () {

  type Action = {
    id: number;
    label: string;
    icon: ReactElement;
    action: () => void | Promise<void>
  }

  
  const { curQuestion, currentQuiz, addQuestion, addTrueOrFalseQuestion, cloneQuestion, handleDeleteQuestion, } = useBuilder();
  
  
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
  
  const actions: Action[] = [
    {
      id: 1,
      label: 'Múltipla Escolha',
      icon: <List size={13} />,
      action: addQuestion
    },{
      id: 2,
      label: 'Verdadeiro ou Falso',
      icon: <CheckSquare size={13} />,
      action: addTrueOrFalseQuestion
    },
    {
      id: 3,
      label: 'Clonar',
      icon:<Copy size={12} />,
      action: cloneQuestion
    }, {
      id: 4,
      label: 'Excluir',
      icon: <Trash2 size={12} />,
      action: handleDelete
    }
    
  ]
  const canDelete = currentQuiz?.questions?.length > 1;
  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-border px-3 py-3">
       {actions.map(({id, label, icon, action}) => (
        <Button
          key={id}
          type="button"
          intent="alternate"
          size="sm"
          disabled={label === 'Excluir'  && !canDelete}
          className={`h-8 justify-start gap-2 text-xs font-medium hover:bg-tint border-[1.55px] border-tin ${label === 'Excluir' && 'text-destructive hover:text-destructive hover:border-destructive/50 hover:bg-destructive/20'}`}
          onClick={() => action()}>
          {icon}
          {label}
        </Button>

       ))}
       
      </div>
    );
}