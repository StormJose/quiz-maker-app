
import { useBuilder } from '@/contexts/BuilderContext'
import QuizTitle from './QuizTitle'



export default function QuizInformation() {

    const {dispatch: builderDispatch} = useBuilder()

    function handleTitleChange(e) {
        builderDispatch({type: "setTitle", payload: e.target.value})
    }

  return (
    <QuizTitle onHandleTitle={handleTitleChange} />
  )
}
