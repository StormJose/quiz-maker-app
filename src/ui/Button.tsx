import { Loader2Icon } from "lucide-react";
import { Link } from "react-router"


export default function Button({children, to, onClick, styles, type, isLoading, disabled, additionalStyles, tooltip,  tooltipPosition, listeners}) {

    const standard = `bg-main text-gray-100 hover:bg-indigo-400 hover:no-underline rounded-md`;
    const alternate = `bg-neutral-100 text-gray-900  hover:bg-neutral-200 rounded-md`;
  
    const cancel = `bg-red-300 text-red-600  hover:bg-red-200 rounded-md`;

    // Tweaks needed for the tooltip feature to work out. 
    // Remember to study this process later you lazy ass mf.

    const content = (
      <div className="relative flex items-center gap-2">
        {children}
        {tooltip && (
          <span
            className={`${
              tooltipPosition === "top" || tooltipPosition === undefined
                ? "translate-y-[-60px] translate-x-[-50%] left-[50%]"
                : "translate-y-[-100%] translate-x-[-50px] left-[-100px] "
            }
              pointer-events-none         
              opacity-0 group-hover/button:opacity-100  
              absolute top-ful 
              mt-2 
            bg-gray-50 text-gray-950 
              font-semibold 
              text-sm p-2.5 
              rounded-xl 
              transition-all 
              whitespace-nowrap`}>
            {tooltip}
          </span>
        )}
      </div>
    );

    if (to)
      return (
        <Link
          {...listeners}
          onClick={onClick}
          to={to}
          className={` ${
            styles === "standard"
              ? standard
              : styles === "alternate"
              ? alternate
              : ""
          }   px-4 py-2 font-semibold hover:cursor-pointer hover:underline  transition-all 
        ${additionalStyles}
        `}>
          {children}
        </Link>
      );

    if (isLoading)
      return (
        <button
          className={`px-4 py-2 flex items-center gap-2 font-medium hover:cursor-pointer  transition-all ${
            styles === "standard"
              ? standard
              : styles === "alternate"
              ? alternate
              : styles === "cancel"
              ? cancel
              : ""
          } `}
          disabled={disabled}>
          <Loader2Icon className="animate-spin" />
          Aguarde
        </button>
      );
    return (
      <button
        {...listeners}
        type={type}
        onClick={onClick}
        className={`px-4 py-1.5 flex items-center gap-2 font-medium hover:cursor-pointer  transition-all ${
          styles === "standard"
            ? standard
            : styles === "alternate"
            ? alternate
            : styles === "cancel"
            ? cancel
            : ""
        }
      ${additionalStyles}
      ${disabled ? "opacity-50 cursor-auto" : ""}
       group/button
      `}
        disabled={disabled}>
        {content}
      </button>
    );
}
