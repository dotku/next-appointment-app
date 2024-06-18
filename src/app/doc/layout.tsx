import AppNavbar from "../../components/Common/Navbar/AppNavbar";
import DocHeader from "./components/DocHeader";

export default function layout({ children }) {
  return (
    <>
      <AppNavbar slug="doc" />
      <div className="container mx-auto px-6">
        <DocHeader />
        {children}
      </div>
    </>
  );
}
