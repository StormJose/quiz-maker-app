import add from "../../assets/add-circle-outline.svg"


export default function ButtonAdd({onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mr-1 group cursor-pointer absolute translate-y-[-50%] top-[50%] right-[4px]  hover:bg-green-100 hover:text-green-700 p-1 rounded-full transition-all">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-green-600">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </button>
  );
}
