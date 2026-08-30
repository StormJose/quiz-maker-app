import { Button } from "./components/ui/button";

export default function Home() {

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex  items-center gap-2">
        <Button   
          to="/quizzes"
          intent="alternate"
>

          Encontrar um quiz
            
        </Button>

        <Button
          to="quiz/new"
          intent={"standard"}
          className={"px-4 py-1.5"}>

              Criar quiz
     
        </Button>
      </div>
    </div>
  );
}
