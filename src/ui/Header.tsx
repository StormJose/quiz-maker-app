import { useQuizzes } from "@/contexts/QuizzesContext";
import { useBuilder } from "../contexts/BuilderContext";
import AutoSave from "./AutoSave";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useParams } from "react-router";

export default function Header() {
  const { status: builderStatus, currentQuiz } = useBuilder();

  const { quizId } = useParams();

  const { status: quizStatus } = useQuizzes();

  const { currentUser, status: authStatus, error } = useAuth();

  if (builderStatus === "ready")
    return (
      <header>
        <nav className="px-4 py-4">
          <ul className="flex justify-between items-center">
            <li>Usuário 23</li>

            <li className="flex justify-center gap-2">
              {builderStatus === "ready" && <AutoSave />}
            </li>
            <li>
              <Button styles="standard" disabled={true} tooltip={"Em breve"}>
                Publicar
              </Button>
            </li>
          </ul>
        </nav>
      </header>
    );

  if (quizStatus === "ready")
    return (
      <header>
        <nav className="px-4 py-4">
          <ul className="flex justify-between items-center">
            <li>LOGO</li>
            <li>Usuário 23</li>
          </ul>
        </nav>
      </header>
    );
}
