import { useBuilder } from "../../contexts/BuilderContext"
import Button from "../../ui/Button";


export default function QuestionItem({item, onSelect, listeners, active}) {

  const { curQuestion, dispatch } = useBuilder()

  function handleSetQuestion () {
    console.log('click')
    console.log(curQuestion)
    dispatch({type: "setCurQuestion", payload: item})
  }


  return (
    <Button
      additionalStyles={" whitespace-nowrap"}
      type={"button"}
      onClick={handleSetQuestion}
      listeners={listeners}>
      <li
        key={item.id}
        className={`
     
          flex px-4 py-2 rounded-md border-[1.5px] bg-gray-100 border-gray-300
          ${active ? "shadow-2xl border-2" : ""}
          ${
            item?.id === curQuestion?.id
              ? " bg-grey border-main text-main  font-semibold"
              : ""
          } 
          `}>
        Pergunta {item?.id}
      </li>
    </Button>
  );
}
