import { useQuizzes } from "@/contexts/QuizzesContext";
import AutoSave from "./AutoSave";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router";

import profile from "../assets/profile.webp";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="px-4 py-4">
        <ul className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <li className="flex items-center">
              <img
                className="w-[45px] h-[45px] rounded-[50%]"
                src={profile}
                alt="profile"
              />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
