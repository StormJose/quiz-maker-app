import { useLocation, useNavigate } from "react-router";
import arrowBack from "../assets/arrow-back.svg"
import { useBuilderStore } from "../store/builderStore";

export default function BackLink() {
  const location = useLocation();
  const navigate = useNavigate();

  const resetBuilder = useBuilderStore((s) => s.resetBuilder);

  function handleNavigate() {
    navigate(-1, { replace: true, preventScrollReset: true });
    resetBuilder();
  }

  if (location.pathname !== "/")
    return (
      <button className="cursor-pointer" onClick={handleNavigate}>
        <img className="w-6 h-6" src={arrowBack} />
      </button>
    );
}
