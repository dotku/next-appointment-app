// app/about/page.tsx
"use client";

import Link from "next/link";
import { useAppSelector } from "../../store/store";
import { Link as ReactLink } from "@nextui-org/react";

export default function About() {
  const count = useAppSelector((state) => state.counter.value);

  return (
    <div className="container mx-auto">
      <h1>About Page</h1>
      <p>Current Counter Value: {count}</p>
      <div>
        <ReactLink as={Link} href="/counter">
          Counter
        </ReactLink>
        <ReactLink as={Link} href="/counterb">
          CounterB
        </ReactLink>
      </div>
    </div>
  );
}
