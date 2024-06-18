export default function CounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto px-6">{children}</div>;
}
