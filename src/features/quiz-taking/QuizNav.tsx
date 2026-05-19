import Button from "@/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuizNav() {
  return (
    <footer className="mt-10 flex items-center justify-between">
    <Button styles={"alternate"} additionalStyles={"px-6 py-3"}>
      <ArrowLeft width={20} height={20} />
      Previous
    </Button>

      <Button styles={"standard"} additionalStyles={"px-6 py-3 flex"}>
        Next
        <ArrowRight width={20} height={20}/>
      </Button>
    </footer>
  );
}