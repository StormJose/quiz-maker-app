import { useEffect } from "react";
import { useQuizzes } from "../contexts/QuizzesContext";
import Button from "./Button";


export default function ConfirmAction() {

    const { confirmData, confirmHandler, dispatch } = useQuizzes();

    useEffect(() => {
        if (confirmData) document.body.style.overflow = "hidden"
        else document.body.style.overflow = '';
    }, [confirmData])


    function handleConfirmAction(confirmData) {
        confirmHandler(confirmData)
    }
    
    if (confirmData)

    return (
      <>
        <div
          onClick={() => dispatch({ type: "cancelAction" })}
          className="fixed w-full h-full bg-gray-700 opacity-50 backdrop-blur-lg z-50 "></div>
        <div
          className=" left-0  z-50 
                    bg-white absolute 
                    flex flex-col gap-2.5 
                    justify-center items-center 
                    h-[100%] translate-x-[50%] w-[50%] 
                    top-[50%] translate-y-[75%] rounded-xl
                     border-[0.2px] border-secondary">
          <h3>Tem certeza disso?</h3>

          <Button
            onClick={() => handleConfirmAction(confirmData)}
            styles={"standard"}>
            Confirmar
          </Button>
          <Button
            onClick={() => dispatch({ type: "cancelAction" })}
            styles={"alternate"}>
            Cancelar
          </Button>
        </div>
      </>
    );
}
