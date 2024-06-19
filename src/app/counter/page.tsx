// app/counter/page.tsx
"use client";

import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../../store/slices/counterSlice";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Link as ReactLink } from "@nextui-org/react";

export default function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <Button className="button" onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </Button>
      <div>
        <Link href={"/about"} className="block" color="primary">
          Link
        </Link>
        <ReactLink href="/about">React Link</ReactLink>
        <ReactLink as={Link} href={"/about"} className="block" color="primary">
          React Link as
        </ReactLink>
      </div>
    </div>
  );
}
