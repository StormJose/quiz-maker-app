
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const answers = [
  { id: "a", text: "Component styling", status: "default" },
  { id: "b", text: "Navigation and routing", status: "selected" },
  { id: "c", text: "Database migrations", status: "default" },
  { id: "d", text: "Package bundling", status: "default" },
];

export default function QuestionItem() {
  return (
    <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-6  shadow-indigo-950/40 backdrop-blur-xl md:p-10">
      <span className="mb-5 inline-flex rounded-full border border-main/20 bg-main/10 px-3 py-1 text-xs font-medium text-main">
        Múltipla Escolha
      </span>

      <h2 className="mb-8 text-2xl font-semibold leading-snug md:text-4xl">
        What does React Router primarily handle in a React application?
      </h2>

      <div className="grid gap-4">
        {answers.map((answer, index) => (
          <motion.button
            key={answer.id}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-gray p-5 text-left text-dark transition hover:border-main/40 hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gray-200 text-sm text-dark">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="font-medium">
                {answer.text}
              </span>
            </div>

            {answer.status === "correct" && (
              <Check className="size-5 text-emerald-300" />
            )}

            {answer.status === "incorrect" && (
              <X className="size-5 text-rose-300" />
            )}
          </motion.button>
        ))}
      </div>
    </article>
  );
}