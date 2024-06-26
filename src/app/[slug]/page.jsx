"use client";

export default function Page({ params }) {
  return <div>My Post 003: {params.slug.slice(3)}</div>;
}
