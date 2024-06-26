import { NextResponse } from "next/server";
import concurrent from "../../../../utils/concurrent";

const urls = [
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/2",
  "https://jsonplaceholder.typicode.com/todos/3",
];

export async function GET() {
  try {
    const results = await concurrent(urls, 2, 1000);
    console.log("result", results);
    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json(e);
  }
}
