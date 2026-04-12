import { useBuilder } from "@/contexts/BuilderContext";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  FlaskConical,
  Hammer,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const { status, currentQuiz } = useBuilder();

  const [collapsed, setCollapsed] = useState(false);

  const pathnameArr = location.pathname.split("/");
  const curRoute = pathnameArr[pathnameArr.length - 1];

  const menus = [
    {
      id: 1,
      title: "Construir Quiz",
      path: `/quiz/${quizId}/edit`,
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
      icon: <FlaskConical />,
    },
  ];

  const numQuestions = currentQuiz?.questions.length;
  const totalPoints = numQuestions * 15;
  const estimatedTime = numQuestions;

  return (
    <Tooltip.Provider delayDuration={300}>
      <aside
        className={`flex flex-col gap-4 transition-all duration-300 ease-in-out ${
          collapsed ? "w-14" : "w-56"
        }`}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-min cursor-pointer text-start py-2 px-4 rounded-lg hover:bg-gray-100 text-secondary-foreground focus-visible:ring-2 focus-visible:ring-gray-400 focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? (
            <PanelLeftOpen size={24} />
          ) : (
            <PanelLeftClose size={24} />
          )}
        </button>
        <div>
          {!collapsed && (
            <>
              <h2 className="font-bold text-2xl mb-2 whitespace-nowrap">
                Quiz Builder
              </h2>
              {/* <p className="text-sidebar-accent-foreground">
                Crie seu quiz com nossa poderosa ferramenta de criação e
                edição
              </p> */}
            </>
          )}
        </div>
        {/*  */}

        {/* Nav items */}
        <ul className="flex flex-col gap-2 text-secondary-foreground">
          {menus.map((menu) => {
            const isActive =
              curRoute === menu.path ||
              (curRoute === `edit` && menu.path === `/quiz/${quizId}/edit`) ||
              (curRoute === "new" && menu.path === "");

            const linkClass = `flex items-center gap-1.5 font-bold rounded-lg px-4 py-1.5 transition-colors
              ${collapsed ? "justify-center px-0" : "justify-start"}
              ${isActive ? "bg-main text-primary-foreground" : "hover:bg-gray-100"}`;

            return (
              <li key={menu.id}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <NavLink to={menu.path} className={linkClass}>
                      <span className="shrink-0">{menu.icon}</span>
                      {!collapsed && (
                        <span className="truncate">{menu.title}</span>
                      )}
                    </NavLink>
                  </Tooltip.Trigger>

                  {collapsed && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={8}
                        className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md
                          data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0
                          data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
                        {menu.title}
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              </li>
            );
          })}
        </ul>
        {/*  */}
        <div
          className={`flex flex-col items-center ${!collapsed ? "items-start" : ""} space-y-4 ${status === "loading" && "opacity-45"} `}>
          <p>
            {!collapsed && <span>N° de questões:</span>}
            <b> {numQuestions}</b>
            {collapsed && "Q"}
          </p>
          <p className={`flex ${collapsed ? "flex-col" : ""}`}>
            {!collapsed && <span>Pontuação máxima:</span>}
            <b> {totalPoints}</b>
            {collapsed && "pts"}{" "}
          </p>
          <p className={`flex ${collapsed ? "flex-col" : ""} items-center `}>
            {!collapsed && <span>Tempo estimado (min):</span>}
            <b>{estimatedTime}</b>
            {collapsed && "min"}
          </p>
        </div>
        {/*  */}
      </aside>
    </Tooltip.Provider>
  );
}
