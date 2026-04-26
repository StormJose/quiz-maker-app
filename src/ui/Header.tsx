import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useNavigate } from "react-router";
import profile from "../assets/profile.webp";
import { LogOut, Settings, User } from "lucide-react";
import { MenuList } from "@/types/menus";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const { signOut } = useAuth();

  function handleSignOut () {

    signOut()
    navigate("/signin")
  }
  const menus: MenuList = [
    {
      id: 1,
      label: "View Profile",
      icon: <User className="w-5 h-5" />,
      action: () => navigate("/profile"),
    },
    {
      id: 2,
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      action: () => navigate("/settings"),
    },
    {
      id: 3,
      label: "Sign Out",
      icon: <LogOut className="w-5 h-5" />,
      action: () => handleSignOut(),
    },
  ];


  return (
    <header>
      <nav className="px-8 py-4">
        <ul className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <li className="flex items-center">
              <NavigationMenu.Root className="">
                <NavigationMenu.List>
                  <NavigationMenu.Item>
                    {/* Trigger — the profile picture */}
                    <NavigationMenu.Trigger asChild>
                      <button style={{ all: "unset", cursor: "pointer" }}>
                        <Avatar.Root>
                          <Avatar.Image
                            className="w-[45px] h-[45px] rounded-full"
                            src={profile}
                            alt="profile"
                          />
                          <Avatar.Fallback className="w-[45px] h-[45px] rounded-full bg-gray-200 flex items-center justify-center">
                            User
                          </Avatar.Fallback>
                        </Avatar.Root>
                      </button>
                    </NavigationMenu.Trigger>

                    {/* Dropdown content */}
                    <NavigationMenu.Content className="z-50 absolute top-[100%] left-0 rounded-sm border-[1px] border-solid border-tint shadow-xs p-4 min-w-[190px] bg-white">
                      <ul>
                        {menus.map(({ label, icon, action }, i) => (
                          <NavigationMenu.Item
                            key={i}
                            className={`${isHovered === i && "bg-gray"} p-[8px] text-sm flex items-center gap-2 px-4 rounded-sm ${label === "Sign Out" ? "hover:text-red-500" : "hover:text-main"} cursor-pointer`}
                            onMouseEnter={() => setIsHovered(i)}
                            onMouseLeave={() => setIsHovered(null)}
                            onClick={action}>
                            <div>{icon}</div>
                            <span>{label}</span>
                          </NavigationMenu.Item>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </NavigationMenu.List>

                {/* Required Radix viewport — positions the floating panel */}
                <NavigationMenu.Viewport style={{ position: "relative" }} />
              </NavigationMenu.Root>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
