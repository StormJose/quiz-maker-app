import { Outlet, useNavigate, useNavigation } from "react-router";
import BackLink from "./BackLink";
import Header from "./Header";
import Loader from "./Loader";
import ConfirmAction from "./ConfirmAction";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function AppLayout() {
  const navigation = useNavigation();

  const navigate = useNavigate();

  const { error } = useAuth();

  useEffect(() => {
    if (error) {
      navigate("/signin");
    }
  }, [error, navigate]);

  return (
    <div className="font-noto relative ">
      <ConfirmAction />
      <Header />
      <div className="p-4">
        <BackLink />
      </div>
      <main className="grid lg:max-w-[1440px] mx-auto my-0 ">
        {navigation.state === "loading" && <Loader />}
        <Outlet />
      </main>
    </div>
  );
}
