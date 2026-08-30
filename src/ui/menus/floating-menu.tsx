
import { useLocation, useNavigate, useNavigation } from "react-router"
import { useBuilder } from "@/store/builderStore"
import { Switch } from "@/components/ui/switch";


export default function FloatingMenu() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const {currentQuiz, resetBuilder} = useBuilder();
  const isChecked = location.pathname.endsWith("/preview");

  function handleSwitchButton() {
    const nextIsChecked = !isChecked;
    const nextRoute = nextIsChecked
      ? `/quiz/${currentQuiz.quizId}/edit/preview`
      : `/quiz/${currentQuiz.quizId}/edit`;

    navigate(nextRoute);
  }


  function handleLeaveBuilder() {
    navigate('/quizzes')
    resetBuilder()
  }
  

  return (
    <div className="" > 
              <div className="flex items-center gap-2">
                <p className="text-gray-600">{ isChecked ? "Preview"  : "Criação"}</p>
                <Switch 
                checked={isChecked} 
                onClick={handleSwitchButton} />
              </div>   
  
    </div>
  );
}

