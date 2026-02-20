import React from "react";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";

const Navbar: React.FC = () => {
  return (
    <>
      <NavbarMobile />
      <NavbarDesktop />
    </>
  );
};

export default Navbar;