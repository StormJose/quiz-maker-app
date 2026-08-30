import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, Moon } from "lucide-react";


type Stage = "idle" | "loading" | "dirty";

interface MultiStageButtonProps {
  children?: ReactNode;
  stage: Stage;
  className: string;
  disabled?: boolean;
  props?: object
  onClick: () => void;
}

export default function MultiStageButton({
children,
  stage = "idle",
  className = "",
  disabled,
  ...props
}: MultiStageButtonProps) {

  const isLoading = stage === "loading"
  const isDirty = stage === "dirty"

  return (
    <motion.button
      disabled={disabled}
      {...props}
      className={`relative cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 bg-primary text-white hover:bg-indigo-400 ${
        disabled && "pointer-events-none bg-primary/70 "
      }
      ${isLoading ? "opacity-80" : ""}
      ${className}`}
      layout
      transition={{ layout: { duration: 0.25, ease: "easeOut" } }}>
      {/* Dirty state */}
      <motion.div
        layout
        className="relative w-4 h-4 flex items-center justify-center">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              layoutId="badgeIcon"
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="z-10">
              <Circle size={16} className="text-white" />
            </motion.div>
          )}

          {isDirty && (
            <motion.div
              layoutId="badgeCheck"
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="z-10">
              <Moon size={16} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Text */}
      <motion.span
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative z-10 text-sm font-medium">
        {stage === "idle" && !isLoading && (children || "Tudo atualizado")}
        {stage === "dirty" && "Salvar alterações"}
        {isLoading && "Salvando alterações..."}
      </motion.span>
    </motion.button>
  );
}
