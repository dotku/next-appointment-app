"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import classNames from "classnames";

function AppNavbar({ slug, theme = "light" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <Navbar
      className={classNames({
        "dark text-foreground bg-background": theme === "dark",
      })}
    >
      <NavbarBrand>
        <Link className="font-bold text-inherit" href="/">
          AptApp
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={["home", "/"].includes(slug)}>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={["admin"].includes(slug)}>
          <Link color="foreground" href="admin">
            Admin
          </Link>
        </NavbarItem>
        <NavbarItem isActive={["appointment"].includes(slug)}>
          <Link color="foreground" href="appointment">
            Appointment
          </Link>
        </NavbarItem>
        <NavbarItem isActive={["doc"].includes(slug)}>
          <Link color="foreground" href="/doc">
            Doc
          </Link>
        </NavbarItem>
      </NavbarContent>

      <ProfileDropdown />
    </Navbar>
  ) : null;
}

export default AppNavbar;
