import { ReactElement } from "react"


type Menu = {
    id: number,
    label: string,
    href?: string,
    icon: ReactElement,
    action: () => void | Promise<void>
};

export type MenuList = Menu[];



