"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import styled from "styled-components";
import supabase from "../../../services/supabase";
import ProfileDropdown from "./ProfileDropdown";

function AppNavbar({ slug }) {
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Listen for changes in the authentication state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    setMounted(true);

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return mounted ? (
    <Navbar maxWidth="2xl">
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
