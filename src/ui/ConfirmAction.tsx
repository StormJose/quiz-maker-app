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
        <div onClick={() => dispatch({type: "cancelAction"})} className="overflow-hidden absolute top-0 left-0 w-full h-full bg-black opacity-50 ">
        </div>
        <div className=" left-0 top-0 z-50 
                    bg-white absolute 
                    flex flex-col gap-2.5 
                    justify-center items-center 
                    h-[50%] translate-x-[50%] w-[50%] 
                    translate-y-[50%] rounded-xl
                     border-[0.2px] border-gray-700">
            <h3>Tem certeza disso?</h3>

            <Button onClick={() => handleConfirmAction(confirmData)} styles={"standard"}>Confirmar</Button>
            <Button onClick={() => dispatch({type: "cancelAction"})} styles={"alternate"}>Cancelar</Button>
        </div> 
        </>
    );
}
