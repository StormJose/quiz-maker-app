
import { useBuilder } from "../../contexts/BuilderContext";
import QuestionItem from "./QuestionItem";
import DragAndDropWrapper from "../../ui/DragAndDropWrapper";


export default function QuestionsTrack () {

  const { currentQuiz } = useBuilder()


  return (
    <DragAndDropWrapper
      collection={currentQuiz.questions}
      dispatchAction={"reorderQuestions"}
      ItemComponent={QuestionItem}
      controlBtns

      />
      
  
  );
}