import Button from "@/ui/Button"
import { Hammer, Settings, TestTube } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnameArr = location.pathname.split("/");
  const curRoute = pathnameArr[pathnameArr.length - 1];

  const menus = [
    {
      id: 1,
      title: "Construir Quiz",
      path: "",
      icon: <Hammer />,
    },
    {
      id: 2,
      title: "Definições",
      path: "settings",
      icon: <Settings />,
    },
    {
      id: 3,
      title: "Preview",
      path: "preview",
      icon: <TestTube />,
    },
  ];

  return (
    <div>
      <ul className="flex flex-col gap-2 text-secondary-foreground">
        {menus.map((menu) => (
          <li key={menu.id}>
            <NavLink
              to={menu.path}
              className={`flex items-center justify-self-start px-4 py-1.5 gap-1.5 font-bold rounded-lg ${
                (curRoute === menu.path ||
                  (curRoute === "edit" && menu.path === "") ||
                  (curRoute === "new" && menu.path === "")) &&
                "bg-main text-primary-foreground "
              } `}>
              <span>{menu.icon}</span>
              {menu.title}
            </NavLink>
            {/* <Button
              onClick={() => navigate(menu.path)}
              styles={
                (curRoute === menu.path ||
                  (curRoute === "edit" && menu.path === "") ||
                  (curRoute === "new" && menu.path === "")) &&
                "standard"
              }>
              <span>{menu.icon}</span>
              <p>{menu.title}</p>
            </Button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
