import App from "../src/App";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page({ params }: { params: { slug: string } }) {
  console.log("params.slug", params.slug);
  return <App />;
}
