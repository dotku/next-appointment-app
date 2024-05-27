"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  DropdownSection,
} from "@nextui-org/react";
import Link from "next/link";
// import { useRouter } from "next/router";
import styled from "styled-components";
import supabase from "../../services/supabase";

const CustomAvatar = styled.div`
  .transition-opacity {
    transition: none !important;
    opacity: 100;
  }
`;

export default function AppNavbar({ slug }) {
  const [session, setSession] = useState(null);
  // const router = useRouter();

  console.log("slug", slug);

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

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  console.log("session", session);

  return (
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

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <CustomAvatar>
              <Avatar
                isBordered
                as="button"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={`https://i.pravatar.cc/150?u=${
                  session ? session.user.email : null
                }`}
              />
            </CustomAvatar>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection showDivider>
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {session ? session.user.email : null}
                </p>
              </DropdownItem>
              <DropdownItem key="finder">Finder</DropdownItem>
              <DropdownItem key="provider">Provider</DropdownItem>
              <DropdownItem key="schedule">Scheduler</DropdownItem>
              <DropdownItem key="profile">Profile</DropdownItem>
            </DropdownSection>
            <DropdownSection title="Help" showDivider>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem key="logout" color="danger" className="text-danger">
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
