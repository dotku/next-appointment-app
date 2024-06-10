"use client";

import "./App.css";
import BookingPage from "../src/components/Customer/BookingPage";
import AppNavbar from "../src/components/Common/Navbar/AppNavbar";
import Header from "../src/components/Common/Header/HomeHeader";

function App() {
  console.log(
    "REACT_NEXT_PUBLIC_SUPABASE_URL",
    process.env,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY
  );
  return (
    <div>
      <AppNavbar slug="home" />
      <div className="container mx-auto px-6">
        <Header />
        <hr className="my-4" />
        <BookingPage />
      </div>
    </div>
  );
}

export default App;
