import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";


const headingVariants = cva("leading-snug", {
  variants: {
    as: {
      h1: "text-5xl font-semibold text-dark",
      h2: "text-3xl font-semibold text-dark",
      h3: "text-md font-medium text-dark",
    },
  },
  defaultVariants: {
    as: "h1",
  },
});

type HeadingProps = VariantProps<typeof headingVariants> & {
  className?: string;
  children: React.ReactNode;
};

export function Heading({ as: Tag = "h1", className, children }: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ as: Tag }), className)}>
      {children}
    </Tag>
  );
}
