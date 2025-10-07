import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useNavigation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import BackLink from "./BackLink";
import Loader from "./Loader";
import Header from "./Header";
import ConfirmAction from "./ConfirmAction";
import Button from "./Button";
import WarningDialog from "./Dialog";
import { useWarningDialog } from "@/hooks/useWarningDialog";

export default function AppLayout() {
  const navigation = useNavigation();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const { error } = useAuth();
  const { Dialog } = useWarningDialog();

  useEffect(() => {
    if (error) {
      navigate("/signin");
    }
  }, [error, navigate]);

  return (
    <div className="font-noto ">
      <ConfirmAction />
      <Header />
      <div className="grid grid-cols-2 mx-8">
        {Dialog}
        <div className="p-4 ">
          <BackLink />
        </div>
        {pathname === "/builder" && (
          <div className="flex justify-end gap-2 items-center">
            <Button styles={"alternate"}>Salvar como rascunho</Button>
            <Button styles={"standard"} disabled={true} tooltip={"Em breve"}>
              Publicar
            </Button>
          </div>
        )}
      </div>
      {navigation.state === "loading" && <Loader />}
      <main className="grid lg:max-w-[1440px] mx-auto my-0 ">
        <Outlet />
      </main>
    </div>
  );
}
