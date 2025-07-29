import { MinusCircle } from "lucide-react";

export default function ButtonDelete({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="group cursor-pointer">
      <MinusCircle className="text-red-500 hover:text-red-400 w-6 h-6" />
    </button>
  );
}
