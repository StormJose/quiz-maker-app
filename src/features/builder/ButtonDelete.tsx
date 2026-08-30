import { MinusCircle } from "lucide-react";

export default function ButtonDelete({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <MinusCircle className={` text-red-500 hover:text-red-400 w-6 h-6`} />
    </button>
  );
}
