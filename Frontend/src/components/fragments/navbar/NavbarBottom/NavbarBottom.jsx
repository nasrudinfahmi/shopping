import { NAVBAR_BOTTOM } from "../../../../utils/constants"
import NavItem from "./NavItem"

function NavbarBottom() {
  return (
    <nav className="z-[99999] fixed w-full py-1 bottom-0 left-0 shadow-navbottom border-t border-t-slate-200/40 bg-white rounded-t-xl">
      <ul className="flex justify-around">
        {NAVBAR_BOTTOM.map((nav, index) => (
          <NavItem key={index} {...nav} />
        ))}
      </ul>
    </nav>
  )
}

export default NavbarBottom