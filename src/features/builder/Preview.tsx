import { useState } from "react";
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import { useBuilder } from "@/store/builderStore";
import { Button } from "@/components/ui/button";

export default function Preview() {
  const [curQuestion, setCurQuestion] = useState(0)

  const {
    isLoading,
    currentQuiz
  } = useBuilder();


   function handleNextQuestion() {
    if (currentQuiz.questions.length - 1 == curQuestion) return
    setCurQuestion(cur => cur + 1)
   }

   function handlePreviousQuestion() {
    if (curQuestion == 0 ) return
     setCurQuestion(cur => cur - 1)
   }


  if (currentQuiz === null) return <div>Erro ao carregar quiz</div>;

  if (isLoading) return <BuilderSkeleton/>


  return (
    <div className="px-4 flex flex-col gap-12 relative">
     
      <div>

      <h3 className="mt-12 mb-auto text-center">
        {currentQuiz.questions[curQuestion]?.description}
      </h3>
      </div>
      <ul className="list-none flex flex-col gap-2 mt-12">

      {currentQuiz.questions[curQuestion]?.answers.map((answer) => (
        <li className="cursor-pointer px-2 py-4 rounded-xl">{answer.content}</li>
      ))}
      </ul>
      <footer className="flex justify-between px-4 py-8 mt-12 w-full border-t-[1.55px] border-grey bottom-0 rounded-xl">
        <Button
          intent={"alternate"}

          onClick={handlePreviousQuestion}>
          Anterior
        </Button>

        <Button
          intent={"standard"}
   
          onClick={handleNextQuestion}>
          Próxima
        </Button>
      </footer>
         
    </div>
  );
}



