"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarContent,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "src/services/supabase";
import styled from "styled-components";
import SignUpButton from "../../../../app/components/Auth/SignUpButton";

const CustomAvatar = styled.div`
  .transition-opacity {
    transition: none !important;
    opacity: 100;
  }
`;

export default function ProfileDropdown() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Check current session
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
  };

  useEffect(() => {
    getSession();
    setIsClient(true);
  }, []);

  const handleLogOutClick = () => {
    supabase.auth.signOut();
    setSession(null);
    if (isClient) {
      router.push("/");
    }
  };

  return (
    <NavbarContent as="div" justify="end" style={{ flexGrow: 0 }}>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <CustomAvatar>
            {session ? (
              <Avatar
                isBordered
                showFallback
                as="button"
                name="Jason Hughes"
                size="sm"
                src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${session.user.email}`}
              />
            ) : (
              <SignUpButton />
            )}
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
            <DropdownItem key="help_and_feedback">Help & feedback</DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              onClick={handleLogOutClick}
            >
              Log out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
}
