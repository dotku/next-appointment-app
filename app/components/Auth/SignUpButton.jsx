"use client";

import { Button, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function SignUpButton() {
  const pathname = usePathname();
  const href = pathname !== "/auth/signin" ? "/auth" : "/auth/signup";
  const title = pathname !== "/auth/signin" ? "Sign in" : "Sign up";
  console.log("pathname", pathname);
  return (
    <Button href={href} variant="bordered" as={Link}>
      {title}
    </Button>
  );
}
