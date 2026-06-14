
import { Button } from "@/components/ui/button";
import { Input } from "@/ui/input";


export default function Settings() {
  return (
    <div className="md:max-w-[440px] max-w-[1440px] h-screen my-0 mx-auto py-[120px] flex flex-col  justify-center gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-bold">Nome de usuário</label>
        <Input />
      </div>
      <Button className={"self-start"} intent={"standard"}>Salvar alterações</Button>
    </div>
  );
}
