
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/contexts/BuilderContext";
import { Copy, SmilePlus, SquaresSubtract, Trash } from "lucide-react";
import { useNavigate } from "react-router";


export default function Toolbox() {

  const navigate = useNavigate()

  const { dispatch:builderDispatch, currentQuiz, curQuestion } = useBuilder() 


  function handleAddQuestion() {
    const questions = currentQuiz?.questions ?? [];

    const newId = questions.length
      ? Math.max(...questions.map((question) => question.id)) + 1
      : 1;

    const newQuestion = {
      id: newId,
      description: `Nova pergunta ${newId}`,
      answers: [
        {
          id: Date.now(),
          content: "Essa é sua primeira resposta",
          correctAnswer: true,
        },
      ],
    };
    builderDispatch({ type: "addQuestion", payload: newQuestion });
  }

  async function handleDeleteQuestion() {
    await builderDispatch({type: "deleteQuestion", payload: curQuestion.id})
    console.log(curQuestion)
  }

  const tools = [
    {
      id: 1,
      title: "Múltipla escolha",
      type: "addStandardQuestion",
      icon: <SmilePlus/>,
      handler: handleAddQuestion
    }
    ,
   { id: 2,
    title: "Verdadeiro Ou Falso",
    type: "addTrueFalseQuestion",
    icon: <SquaresSubtract/>
    },
  {
    id : 3,
    title: "Clonar Questão",
    type: "cloneQuestion",
    icon: <Copy/>,
    hideTitle: true
  },
  {
    id : 4,
    title: "Excluir Questão",
    type: "deleteQuestion",
    icon: <Trash/>,
    hideTitle: true,
    color: 'text-red-500',
    handler: handleDeleteQuestion
  }
  ]

  return (
    <div className="border-t-[1.55px] border-secondary py-4 flex flex-col gap-2">
      <h4 className="font-semibold">
        Gerenciar questões
      </h4>
      <div>
       <ul className="flex items-center gap-2">
        {tools.map((tool) => (
          <li key={tool.id}>
            <Button 
              type={"button"}
              title={tool.title} 
              variant={"secondary"} 
              disabled={tool.type === "deleteQuestion" && currentQuiz.questions.length === 1}
              size={"sm"} 
              className={tool?.color} 
              onClick={tool.handler}
              >
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
