// /app/page.tsx

"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../lib/store";
import { increment, decrement } from "../../lib/features/counter/counterSlice";
import { Button } from "@nextui-org/react";

export default function CounterPage() {
  const dispatch = useDispatch();
  const count = useSelector((state: AppState) => state.counter.value);

  return (
    <div>
      <h1>Count: {count}</h1>
      <div className="flex gap-4">
        <Button variant="bordered" onClick={() => dispatch(increment())}>
          Increment
        </Button>
        <Button variant="bordered" onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
      </div>
    </div>
  );
}
