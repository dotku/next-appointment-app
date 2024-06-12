"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import classNames from "classnames";
import { SearchIcon } from "@/app/home/components/SearchIcon";

function AppNavbar({ slug, theme = "light", maxWidth }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <Navbar
      maxWidth={maxWidth || "2xl"}
      className={classNames({
        "dark text-foreground bg-background": theme === "dark",
      })}
    >
      <NavbarBrand className="hidden md:flex">
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
      <NavbarContent className="">
        <Input
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "border-0",
              "focus:outline-none",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              "focus:ring-offset-0 focus:ring-0",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
      </NavbarContent>

      <ProfileDropdown />
    </Navbar>
  ) : null;
}

export default AppNavbar;
