
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/contexts/BuilderContext";
import { feedback } from "@/utils/toast-utils";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { Copy, SmilePlus, SquaresSubtract, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Toolbox() {
  const navigate = useNavigate();

  const {
    isLoading,
    dispatch: builderDispatch,
    handleDeleteQuestion,
    currentQuiz,
    curQuestion,
  } = useBuilder();

  const questions = currentQuiz?.questions ?? [];

  async function handleAddQuestion() {
    builderDispatch({ type: "addQuestion" });
  }

  function handleAddTrueOrFalseQuestion() {
    builderDispatch({ type: "addTrueOrFalseQuestion" });
  }

  function cloneQuestion() {
    builderDispatch({ type: "cloneQuestion" });
  }

  // Refactor logic later

  async function deleteQuestion() {
    try {
      await handleDeleteQuestion(curQuestion.id);
      toast.success("Pergunta excluída");
    } catch (error) {
      feedback.error("Erro ao excluir pergunta");
    }
  }

  const tools = [
    {
      id: 1,
      title: "Múltipla escolha",
      type: "addStandardQuestion",
      icon: <SmilePlus />,
      handler: handleAddQuestion,
    },
    {
      id: 2,
      title: "Verdadeiro Ou Falso",
      type: "addTrueFalseQuestion",
      icon: <SquaresSubtract />,
      handler: handleAddTrueOrFalseQuestion,
    },
    {
      id: 3,
      title: "Clonar Questão",
      type: "cloneQuestion",
      icon: <Copy />,
      hideTitle: true,
      handler: cloneQuestion,
    },
    {
      id: 4,
      title: "Excluir Questão",
      type: "deleteQuestion",
      icon: <Trash />,
      hideTitle: true,
      color: "text-red-500",
      handler: deleteQuestion,
    },
  ];

  return (
    <div className="border-t-[1.55px] border-secondary py-4 flex flex-col gap-2">
      <h4 className="font-semibold">Gerenciar questões</h4>
      <div>
        <ul className="flex items-center gap-2">
          {tools.map((tool) => (
            <li key={tool.id}>
              <Button
                type={"button"}
                title={tool.title}
                variant={"secondary"}
                disabled={
                  (tool.type === "deleteQuestion" && isLoading) ||
                  (tool.type === "deleteQuestion" &&
                    currentQuiz?.questions.length === 1) ||
                  curQuestion === null
                }
                size={"sm"}
                className={`${tool?.color} hover:bg-primary-foreground active:translate-y-[2.22px]`}
                onClick={tool.handler}>
                {tool.icon}
                {!tool.hideTitle && tool?.title}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
