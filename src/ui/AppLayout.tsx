import supabase from "@/utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router";
import BackLink from "./BackLink";
import Loader from "./Loader";
import Header from "./Header";
import ConfirmAction from "./ConfirmAction";
import Button from "./Button";
import { useEffect } from "react";
import { getCurrentUser } from "@/auth/auth";

export default function AppLayout() {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const pathname = useLocation().pathname;

  const { currentUser, error } = useAuth();

  // useEffect(() => {
  //   if (!currentUser.id) {
  //     navigate("/signin");
  //   }
  // }, [currentUser]);

  if (error.type != "SessionMissingError")
    return (
      <div className="font-noto ">
        <ConfirmAction />
        <Header />
        <div className="grid grid-cols-2 mx-8">
          <div className="py-4">
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
        <main className="grid lg:max-w-[1440px] mx-auto my-0 ">
          <Outlet />
        </main>
      </div>
    );
}

export const protectedLoader = async () => {
  const session = await getCurrentUser();
  if (!session) return redirect("/signin");
  return null;
};
