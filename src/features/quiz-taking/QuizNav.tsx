
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuizNav() {
  return (
    <footer className="mt-10 flex items-center justify-between">
    <Button intent={"alternate"}>
      <ArrowLeft width={20} height={20} />
      Previous
    </Button>

      <Button intent={"standard"} >
        Next
        <ArrowRight width={20} height={20}/>
      </Button>
    </footer>
  );
}