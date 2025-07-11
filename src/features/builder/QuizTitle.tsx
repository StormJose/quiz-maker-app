import edit from "../../assets/edit.svg";
import { useBuilder } from "../../contexts/BuilderContext";
import Loader from "../../ui/Loader";

export default function QuizTitle({onHandleTitle}) {

  const { isLoading, currentQuiz } = useBuilder();

  if (isLoading) return <Loader/>

  return (
    <div className="self-start flex gap-1.5 relative">
      <input
        className="w-[100%] font-bold relative py-2 border-b-[1.55px] border-b-secondary focus:outline-0 focus:border-b-[1.88px] focus:border-grey transition-colors"
        name="title"
        onChange={(e) => onHandleTitle(e)}
        value={currentQuiz?.title || ""}
      />
      <img
        className="w-5 h-5 absolute right-0 mr-4 bottom-3"
        src={edit}
        alt="edit icon"
      />
    </div>
  );
}
