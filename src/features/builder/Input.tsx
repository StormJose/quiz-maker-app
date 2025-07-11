import { useEffect, useState } from "react";
import ButtonDelete from "./ButtonDelete";
import ButtonAdd from "./ButtonAdd";
import { useBuilder } from "../../contexts/BuilderContext";
import Button from "../../ui/Button";

// TO DO: Apply drag n' drop functionality to the answers
export default function Input({item, active, listeners}) {
  const [input, setInput] = useState(item.content);
  const [isChanged, setIsChanged] = useState(false);
  const [isFocused, setIsFocused] = useState(false)

  const { curQuestion, dispatch } = useBuilder()


  // For now, it is not possible to undo the changes after the input loses focus because 
  // the component wouldn't be able to save the changes. 
  useEffect(() => {
    setIsChanged(input !== item.content);

    if (!isChanged && !isFocused) setInput(item.content)

  }, [input, item.content, isChanged, isFocused]);



  function handleFocus() {
    setIsFocused(true)
    console.log(isFocused);
  }

  function handleBlur() {
    setIsFocused(false)
    console.log(isFocused)
  }

  function handleChangeAnswer(e) {
    setInput(e.target.value);
 
  }

  function handleConfirmChanges(id:integer) {
    if (!isChanged) return;
   
    const updatedAnswers = curQuestion.answers.map((answer) => 
      answer.id === id ? {...answer, content: input} : answer
    )
  
    const updatedQuestion = {
      ...curQuestion,
      answers: updatedAnswers
    }

    dispatch({type: "updateQuestion", payload: updatedQuestion})
  }

  function handleDeleteAnswer(id:integer) {

    const newQuestion = {
      ...curQuestion,
      answers: curQuestion.answers.filter((answer) => answer.id !== id)
    }

    dispatch({type: "updateQuestion", payload: newQuestion})
  }

  return (
    <li className=" flex gap-2 justify-between items-center">
      <Button
        additionalStyles={"draggable-btn"}
        type={"button"}
        listeners={listeners}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </Button>

      <label className="relative">
        <input
          className="border-[1.5px] w-full rounded-2xl border-gray-200 px-4 py-2 focus:outline-gray-500"
          name={` answer`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChangeAnswer}
          value={input}
        />
        {isChanged && (
          <ButtonAdd onClick={() => handleConfirmChanges(item.id)} />
        )}
      </label>

      <div className="flex items-center gap-1">
        <ButtonDelete onClick={() => handleDeleteAnswer(item.id)} />
      </div>
    </li>
  );
}