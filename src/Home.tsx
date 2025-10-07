import { Link, useNavigate } from "react-router";
import BackLink from "./ui/BackLink";
import Button from "./ui/Button";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex  items-center gap-2">
        <Link to="/quizzes">
          <Button styles="alternate">Encontrar um quiz</Button>
        </Link>
        <Link>
          <Button to="/quiz/new" styles="standard">
            Criar Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
