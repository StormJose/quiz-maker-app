import { useLocation, useNavigate } from "react-router";
import arrowBack from "../assets/arrow-back.svg"
import { useBuilder } from "../contexts/BuilderContext";

export default function BackLink() {

  const location = useLocation();
  const isInQuiz = location.pathname
    .split("/")
    .filter((segment) => segment === "quizzes")[0];
 
 
  const navigate = useNavigate()

  const { dispatch } = useBuilder()

  function handleNavigate() {
    navigate('/')
    dispatch({type: "resetBuilder"})
  }
  
  if (isInQuiz) return null

  if (location.pathname !== '/') return (
    <button className="cursor-pointer" onClick={handleNavigate}>
      <img className="w-6 h-6" src={arrowBack} />
    </button>
  );
}
