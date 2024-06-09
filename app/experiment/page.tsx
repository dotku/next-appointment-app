"use client";

import { useAppSelector } from "@/lib/hooks";

export default function About() {
  const count = useAppSelector((state) => state.counter.value);

  return (
    <div>
      <h1>About Page</h1>
      <p>Current Counter Value: {count}</p>
    </div>
  );
}
