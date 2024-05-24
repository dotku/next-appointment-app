import logo from "./logo.svg";
import "./App.css";
import Contacts from "./data/dummyContact.json";
import BookingPage from "./components/Customer/BookingPage";
import Header from "./components/Common/Header";

function Cell({ row }) {
  const objectKeys = Object.keys(row);
  return objectKeys.map((key) => <td key={key}>{row[key]}</td>);
}

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
