


export default function ButtonDelete({onClick}) {
  return (
    <button type="button" onClick={onClick} className="group cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-9 h-9 text-red-600 group-hover:text-red-900 group-hover:bg-red-100 rounded-4xl group-hover:transition-colors"
        viewBox="0 0 512 512">
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeWidth="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="M336 256H176"
        />
      </svg>
    </button>
  );
}
