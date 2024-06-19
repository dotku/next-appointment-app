"use client";

import AppNavbar from "@/src/components/Common/Navbar/AppNavbar";
import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Link, Spinner } from "@nextui-org/react";
import styled from "styled-components";

const Header = styled.h1`
  display: inline-block;
  margin: 0 20px 0 0;
  padding: 0 23px 0 0;
  font-size: 24px;
  font-weight: 500;
  vertical-align: top;
  line-height: 49px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
  line-height: 49px;
  margin: 0;
`;

export default function LayoutClient({ children }) {
  const { isLoading, session } = useSupabaseSession();

  if (isLoading)
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );

  if (!session) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div>
          <Header className="next-error-h1">401</Header>
          <div style={{ display: "inline-block" }}>
            <Subtitle>
              Not Authorized. Please <Link href="/auth">login</Link> and try
              again.
            </Subtitle>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppNavbar slug="account" maxWidth="full" />
      <div className="container mx-auto">{children}</div>
    </>
  );
}
