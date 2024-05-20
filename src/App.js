import logo from "./logo.svg";
import "./App.css";
import Contacts from "./data/dummyContact.json";
import BookingPage from "./components/Customer/BookingPage";

function Cell({ row }) {
  const objectKeys = Object.keys(row);
  return objectKeys.map((key) => <td key={key}>{row[key]}</td>);
}

function App() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mt-4">Appointment Booking App</h1>
      <p>
        Appointment App is used to book appointment between customer, sevice
        provider and specialists.
      </p>
      <p>
        This application could apply to nail, hair, clinic or any service that
        provide service that need a scheduling service
      </p>
      <hr className="my-4" />
      <BookingPage />
    </div>
  );
}

export default App;
