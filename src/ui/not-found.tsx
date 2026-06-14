import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


export default function NotFound() {

  const navigate = useNavigate()

  return (
    <div className="grid h-screen justify-center items-center">
      <div className="flex flex-col gap-4 text-center">

        <h3 className="text-xl font-bold">Página não encontrada </h3>
        <Button
          intent={"standard"}
          className={"flex justify-center px-3 py-2.5"}
          onClick={() => navigate("/")}>
          Voltar à Página Inicial
        </Button>
          </div>
    </div>
  );
}
