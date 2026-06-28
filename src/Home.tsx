import { Link } from "react-router";
import { Button } from "./components/ui/button";

export default function Home() {

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex  items-center gap-2">
        <Button   
          intent="alternate"
>
            <Link to={"/quizzes"}>
          Encontrar um quiz
            </Link>
        </Button>

        <Button
          intent={"standard"}
          className={"px-4 py-1.5"}>
            <Link to={"/quiz/new"}>
              Criar quiz
            </Link>
        </Button>
      </div>
    </div>
  );
}
