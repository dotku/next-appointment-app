import logo from "./logo.svg";
import "./App.css";
import BookingPage from "./components/Customer/BookingPage";
import Header from "./components/Common/Header";

function App() {
  return (
    <div className="container mx-auto px-4">
      <Header />
      <hr className="my-4" />
      <BookingPage />
    </div>
  );
}

export default App;
