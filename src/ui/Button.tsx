import { motion, AnimatePresence } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Link } from "react-router";

type Styles = "standard" | "alternate" | "cancel";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick: () => void;
  styles: Styles;
  type: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  additionalStyles?: string;
  tooltip?: string;
  tooltipPosition?: string; 
  listeners?: () => void
}

export default function Button({
  children,
  to,
  onClick,
  styles,
  type,
  isLoading,
  disabled,
  additionalStyles,
  tooltip,
  tooltipPosition,
  listeners,
}: ButtonProps) {

  type RipplesType = {
    id: number;
    size: number
    x: number;
    y: number

  }

  const [ripples, setRipples] = useState<RipplesType[]>([]);
  console.log(ripples)
  const standard = `bg-main text-gray-100 hover:bg-indigo-400 hover:no-underline`;
  const alternate = `bg-gray text-gray-950  hover:bg-neutral-200 `;
  const cancel = `bg-red-300 text-red-600  hover:bg-red-200 `;

  const typeStyles = {
    standard,
    alternate,
    cancel,
  };

  const currentTypeStyle = typeStyles[styles] || "";

  
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => {
      const updated = [...prev, newRipple];
      return updated;
    });
  }
  // Tweaks needed for the tooltip feature to work out.
  // Remember to study this process later you lazy ass mf.

  const content = (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{
            opacity: 1,
            scale: 0,
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
          animate={{ opacity: 0.8, scale: 2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() =>
            setRipples((prev) => prev.filter((r) => r?.id !== ripple?.id))
          }
          className="absolute rounded-full bg-main pointer-events-none"
        />
      ))}

      {tooltip && (
        <span
          className={`${
            tooltipPosition === "top" || tooltipPosition === undefined
              ? "-translate-y-[50px] left[-60%] "
              : ""
          }
                pointer-events-none         
                opacity-0 group-hover/button:opacity-100  
                absolute top-full 
                mt-2 
              bg-gray-50 text-gray-950 
              font-semibold 
              text-sm 
              p-2.5 
              rounded-full 
             
              transition-all 
              `}>
          {tooltip}
        </span>
      )}
    </AnimatePresence>
  );

  if (to)
    return (
      <Link
        {...listeners}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          handleClick(e);
          if (onClick) onClick();
        }}
        to={to}
        className={`${currentTypeStyle}   font-semibold hover:cursor-pointer relative overflow-hidden rounded-full transition-all 
        ${additionalStyles}
        `}>
        <span className="flex items-center gap-2 relative z-10">
          {children}
        </span>
        {content}
      </Link>
    );

  if (isLoading)
    return (
      <button
        className={` ${currentTypeStyle} flex gap-2 font-semibold hover:cursor-pointer relative overflow-hidden rounded-full transition-all 
        ${additionalStyles}
        `}
        disabled={disabled}>
        <Loader2Icon className="animate-spin" />
        <span>Aguarde</span>
      </button>
    );
  return (
    <button
      {...listeners}
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 font-medium hover:cursor-pointer rounded-full transition-all ${currentTypeStyle} 
      ${additionalStyles}
      ${disabled ? "opacity-50 cursor-none" : ""}
       group/button
      `}
      disabled={disabled}>
      <span className="flex items-center gap-2 relative z-10">{children}</span>
      {content}
    </button>
  );
}
