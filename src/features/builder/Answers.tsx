import { useBuilder } from "../../contexts/BuilderContext";
import Button from "../../ui/Button";
import Input from "./Input";

export default function Answers() {
  const { curQuestion, dispatch } = useBuilder();

  async function handleAddAnswer() {
    const order = curQuestion.answers.length + 1;

    const newAnswer = {
      answerId: crypto.randomUUID(),
      content: "Nova resposta",
      correctAnswer: false,
      order,
    };

    const updatedQuestion = {
      ...curQuestion,
      answers: [...curQuestion.answers, newAnswer],
    };

    await dispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  const answers = curQuestion?.answers?.length > 0 ? curQuestion?.answers : [];
  const maxAnswers = curQuestion.answers?.length === 4;
  return (
    <div className="py-12">
      <div className="flex flex-col gap-3 h-fit">
        {answers.map((answer) => (
          <Input key={answer.answerId} item={answer} />
        ))}
        {curQuestion.type == "multiple_choice" && (
          <Button
            type="button"
            styles="standard"
            additionalStyles={"self-start rounded-md px-4 py-1.5"}
            disabled={maxAnswers}
            onClick={handleAddAnswer}>
            {/* <Plus /> */}
            Adicionar resposta
          </Button>
        )}
      </div>
    </div>
  );
}
