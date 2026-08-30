
import { useLocation, useNavigate } from "react-router"
import { useBuilder } from "@/store/builderStore"
import { Switch } from "@/components/ui/switch";


export default function FloatingMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const {currentQuiz} = useBuilder();
  const isChecked = location.pathname.endsWith("/preview");

  function handleSwitchButton() {
    const nextIsChecked = !isChecked;
    const nextRoute = nextIsChecked
      ? `/quiz/${currentQuiz.quizId}/edit/preview`
      : `/quiz/${currentQuiz.quizId}/edit`;

    navigate(nextRoute);
  }


  return (
    <div className="" > 
        <div className="flex items-center gap-2 px-4 py-2.5 border-[1.55px] rounded-xl">
          <p className="text-gray-600">{ isChecked ? "Preview"  : "Criação"}</p>
          <Switch 
              checked={isChecked} 
              onClick={handleSwitchButton} />
          </div>   
  
    </div>
  );
}

