import { useBuilder } from "../contexts/BuilderContext";
import AutoSave from "./AutoSave";
import Button from "./Button";


export default function Header() {

  const { status } = useBuilder()

  return (
    <header>
      <nav className="px-4 py-4">
        <ul className="flex justify-between items-center">
          <li>Usuário 23</li>

          <li className="flex justify-center gap-2">
            {status === "ready" && <AutoSave />}
          </li>
          <li>

              <Button styles="standard" disabled={true} tooltip={"Em breve"}>
                Publicar
              </Button>
        
          </li>
        </ul>
      </nav>
    </header>
  );
}
