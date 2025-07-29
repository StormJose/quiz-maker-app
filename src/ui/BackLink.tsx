import { useLocation, useNavigate } from "react-router";
import arrowBack from "../assets/arrow-back.svg"
import { useBuilder } from "../contexts/BuilderContext";

export default function BackLink() {
  // mabanque
  const location = useLocation();
  const navigate = useNavigate();

  const { dispatch } = useBuilder();

  const isInQuiz = location.pathname
    .split("/")
    .filter((segment) => segment === "quizzes")[0];

  function handleNavigate() {
    navigate(-1, { replace: true, preventScrollReset: true });
    dispatch({ type: "resetBuilder" });
  }

  if (location.pathname !== "/")
    return (
      <button className="cursor-pointer" onClick={handleNavigate}>
        <img className="w-6 h-6" src={arrowBack} />
      </button>
    );
}
