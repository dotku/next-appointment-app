import AppNavbar from "../../src/components/Common/Navbar/AppNavbar";

export default function layout({ children }) {
  return (
    <>
      <AppNavbar slug="doc" />
      <div className="container mx-auto px-6">{children}</div>
    </>
  );
}
