import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckboxButton } from "@/types/ui/checkbox";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function AnimatedCheckbox({
  className,
  checked,
  onClick,
  ...props
}: CheckboxButton) {
  return (
    <div className="relative grid place-items-center">
      {checked && (
        <motion.div
          className="z-0 absolute inset-0 bg-primary rounded-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <Checkbox.Root
        checked={checked}
        className={`checked:text-primary w-6 h-6 border border-gray-400 rounded-md grid  place-items-center bg-white max-w-6 ${className} `}
        onClick={onClick}
        {...props}>
        <Checkbox.Indicator className="z-10" forceMount>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}>
            <Check
              size={16}
              className={`${checked ? "text-white" : "text-white"}`}
            />
          </motion.div>
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
}
