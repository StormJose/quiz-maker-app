import { useQuizzes } from "@/contexts/QuizzesContext";
import { useBuilder } from "../contexts/BuilderContext";
import AutoSave from "./AutoSave";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const { currentUser, status: authStatus, error } = useAuth();
  const {
    status: builderStatus,
    draftStatus,
    currentQuiz,
    handleInsertQuiz,
  } = useBuilder();
  const { status: quizStatus } = useQuizzes();

  async function handleSaveDraft() {
    const data = await handleInsertQuiz(currentQuiz);

    if (data) {
      navigate("/quizzes");
    }
  }

  if (builderStatus === "ready")
    return (
      <header>
        <nav className="px-4 py-4">
          <ul className="flex justify-between items-center">
            <li>Usuário 23</li>

            <li className="flex justify-center gap-2">
              {builderStatus === "ready" && <AutoSave />}
            </li>
            <li className="flex items-center gap-1">
              <Button
                onClick={handleSaveDraft}
                disabled={draftStatus === "Saving"}
                styles="alternate">
                Salvar como rascunho
              </Button>
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
