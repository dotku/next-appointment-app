import StoreProvider from "../StoreProvider";
import "../../index.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="container mx-auto">{children}</div>
    </StoreProvider>
  );
}
