import { useNavigate } from "react-router";
import Button from "./ui/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex  items-center gap-2">
        <Button
          to={"/quizzes"}
          styles="alternate"
          additionalStyles={"px-4 py-1.5"}>
          Encontrar um quiz
        </Button>

        <Button
          to="/quiz/new"
          styles={"standard"}
          additionalStyles={"px-4 py-1.5"}>
          Criar quiz
        </Button>
      </div>
    </div>
  );
}
