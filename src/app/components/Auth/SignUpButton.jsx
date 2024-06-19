"use client";

import { Button, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

// @note not sure which would be the best intereact behavior
export default function SignUpButton() {
  const pathname = usePathname();
  const href = pathname !== "/auth/signin" ? "/auth" : "/auth/signup";
  const title = pathname !== "/auth/signin" ? "Sign in" : "Sign up";
  console.log("pathname", pathname);
  return !pathname.includes("auth") ? (
    <Button href={href} variant="bordered" as={Link}>
      {title}
    </Button>
  ) : null;
}
