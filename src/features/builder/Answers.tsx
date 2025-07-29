
import { Plus } from "lucide-react";
import { useBuilder } from "../../contexts/BuilderContext";
import Button from "../../ui/Button";
import DragAndDropWrapper from "../../ui/DragAndDropWrapper";
import ButtonAdd from "./ButtonAdd";
import Input from "./Input";

// TO DO: Apply drag n' drop functionality to the answers
export default function Answers() {
  const { curQuestion, dispatch } = useBuilder();

  const maxAnswers = curQuestion.answers?.length === 4;

  async function handleAddAnswer() {
    const newAnswer = {
      id: Date.now(),
      content: `Nova resposta ${curQuestion.answers.length + 1}`,
      correctAnswer: false,
    };

    const updatedQuestion = {
      ...curQuestion,
      answers: [...curQuestion.answers, newAnswer],
    };
    console.log(updatedQuestion);
    await dispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  return (
    <div className="py-12">
      <div className="flex flex-col gap-3 h-fit">
        <DragAndDropWrapper
          collection={curQuestion?.answers}
          dispatchAction={"reorderAnswers"}
          ItemComponent={Input}
          additionalContainerStyles={"py-2"}
          orientation={"vertical"}
        />

        <Button
          type="button"
          styles="standard"
          additionalStyles={"self-start rounded-md"}
          disabled={maxAnswers}
          onClick={handleAddAnswer}>
          <Plus />
          Adicionar resposta
        </Button>
      </div>
    </div>
  );
}
