
import { useBuilder } from "../../contexts/BuilderContext";
import Button from "../../ui/Button"
import DragAndDropWrapper from "../../ui/DragAndDropWrapper";
import ButtonAdd from "./ButtonAdd"
import Input from "./Input"

// TO DO: Apply drag n' drop functionality to the answers
export default function Answers() {

  const { curQuestion, dispatch } = useBuilder()

  const maxAnswers = curQuestion.answers?.length === 4;

  async function handleAddAnswer() {
    
    const newAnswer = {id: Date.now(), content: `Nova resposta ${curQuestion.answers.length + 1}`, correctAnswer: false};   
    
    const updatedQuestion = {
      ...curQuestion,
      answers: [...curQuestion.answers, newAnswer]
    }
    console.log(updatedQuestion)
    await dispatch({type: "updateQuestion", payload: updatedQuestion})
  }
  
  return (
    <div className="py-12">
      <div className="flex flex-col gap-3 h-fit">
        <DragAndDropWrapper
          collection={curQuestion?.answers}
          dispatchAction={"reorderAnswers"}
          ItemComponent={Input}
          additionalContainerStyles={'py-2'}
          orientation={"vertical"}
        />
    
          <Button type="button" styles="standard" additionalStyles={'self-start rounded-md'} disabled={maxAnswers} onClick={handleAddAnswer}>
            Adicionar resposta
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 "
              viewBox="0 0 512 512">
              <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M256 176v160M336 256H176"
              />
            </svg>
          </Button>
          {/* <ButtonAdd handleClick={handleAddAnswer} /> */}
      </div>
    </div>
  );
}
