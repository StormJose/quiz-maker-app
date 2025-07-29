import { FileCheck2, LoaderCircleIcon } from "lucide-react";
import { useBuilder } from "../contexts/BuilderContext";

function AutoSave() {
  const { draftStatus } = useBuilder();

  if (draftStatus === "Saving")
    return <LoaderCircleIcon className="text-primary animate-spin" />;

  if (draftStatus === "Saved")
    return (
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
          />
        </svg>
      </span>
    );

  if (draftStatus === "Offline")
    return (
      <span className=" flex flex-col justify-between items-center transition-all translate-y-2">
        <FileCheck2 className="text-accent-foreground" />
        <p>Fique tranquilo, suas alterações foram salvas localmente.</p>
      </span>
    );
}

export default AutoSave;
