import { useBuilder } from "@/store/builderStore";
import Input from "./Input";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/questions";

export default function Answers() {
  const { curQuestion, updateQuestion } = useBuilder();

  async function handleAddAnswer() {

    if (!curQuestion) return;

    const order = curQuestion.answers.length + 1;

    const newAnswer = {
      answerId: crypto.randomUUID(),
      content: "Nova resposta",
      correctAnswer: false,
      order,
    };


    const updatedQuestion: Question = {
    ...curQuestion,
    answers: [...curQuestion.answers, newAnswer],

  };

    updateQuestion(updatedQuestion)
  }

  const answers = (curQuestion?.answers?.length ?? 0) > 0 ? curQuestion?.answers : [];
  const maxAnswers = curQuestion?.answers.length === 4;
  return (
    <div className="py-12">
      <div className="flex flex-col gap-3 h-fit">
        {answers?.map((answer) => (
          <Input key={answer.answerId} item={answer} />
        ))}
        {curQuestion?.type == "multiple_choice" && (
          <Button
            type="button"
            intent={"standard"}
            disabled={maxAnswers}
            onClick={handleAddAnswer}
            className="self-start">
            Adicionar resposta
          </Button>
        )}
      </div>
    </div>
  );
}
