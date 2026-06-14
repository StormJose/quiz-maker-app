import { useAuth } from "@/contexts/AuthContext";
import {
  Outlet,
  redirect,
} from "react-router";
import BackLink from "./BackLink";
import Header from "./Header";
import { getCurrentUser } from "@/auth/auth";
import { useWarningDialog, WarningDialogProvider } from "@/hooks/useWarningDialog";
import WarningDialog from "./dialogs/warning-dialog";

export default function AppLayout() {

  const { error } = useAuth();

  if (error.type != "SessionMissingError")
    return (
  <WarningDialogProvider>
      <div className="font-noto ">
        <Header />
        <div className="grid grid-cols-2 mx-8">
          <div className="py-4">
            <BackLink />
          </div>

        </div>
        <main className="grid lg:max-w-[1440px] mx-auto my-0 ">
          <Outlet />
        </main>
          <WarningDialog
       
      />
        </div>
    </WarningDialogProvider>
    );
}


export const protectedLoader = async () => {
  const session = await getCurrentUser();
  
  if (!session.user) return redirect("/signin");
 
  return null;
};
