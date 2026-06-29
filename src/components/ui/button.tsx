import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import { cn } from "../../utils"; 
import { Link } from "react-router";

const buttonVariants = cva(
  "inline-flex items-center gap-2 font-semibold cursor-pointer relative overflow-hidden rounded-full transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      intent: {
        standard: "bg-main text-gray-100 hover:bg-indigo-400",
        alternate: "bg-gray text-gray-950 hover:bg-neutral-200",
        cancel: "bg-gray-100 text-red-600 hover:bg-red-200",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",        
        icon: "size-9 justify-center",
      },
    },
    defaultVariants: {
      intent: "standard",
      size: "default",
    },
  }
);

type RippleEntry = {
  id: number;
  size: number;
  x: number;
  y: number;
};

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom";
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export function Button({
  className,
  intent,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  tooltip,
  tooltipPosition = "top",
  children,
  onClick,
  to,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleEntry[]>([]);
  const Comp = asChild ? Slot : "button";

  const isDisabled = disabled || isLoading;

  function handleRipple(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    setRipples((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: e.clientX - rect.left - rippleSize / 2,
        y: e.clientY - rect.top - rippleSize / 2,
        size: rippleSize,
      },
    ]);
  }

  if (to) return <Link to={to} className={cn(buttonVariants({intent, size}), 
  "group/button", 
    className)} 
    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => onClick?.(e)}>
    {children}
  </Link>

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ intent, size }),
        "group/button",
        className
      )}
      disabled={isDisabled}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleRipple(e);
        onClick?.(e);
      }}
      {...props}
    >
      <span className="flex items-center gap-2 relative z-10">
        {isLoading ? (
          <>
            <Loader2Icon className="animate-spin" />
            <span>Aguarde</span>
          </>
        ) : (
          children
        )}
      </span>

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
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
            }
            className="absolute rounded-full bg-main pointer-events-none"
          />
        ))}
      </AnimatePresence>

      {tooltip && (
        <span
          className={cn(
            "pointer-events-none absolute opacity-0 group-hover/button:opacity-100 bg-gray-50 text-gray-950 font-semibold text-sm p-2.5 rounded-full transition-all",
            tooltipPosition === "top"
              ? "-translate-y-[50px]"
              : "top-full mt-2"
          )}
        >
          {tooltip}
        </span>
      )}
    </Comp>
  );
}

export { buttonVariants };