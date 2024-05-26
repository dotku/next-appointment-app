"use client";

import React, { useState, useEffect } from "react";
import ReleaseLog from "../Docs/ReleaseLog/ReleaseLog";
import ProfileCard from "../Elements/ProfileCard";
import { days } from "../Elements/Calendar";

// Dummy data
const dummyUsers = [
  { id: 1, name: "User One" },
  { id: 2, name: "User Two" },
  { id: 3, name: "User Three" },
];

const dummyStudios = [
  { id: 1, name: "Studio One", city: "San Francisco" },
  { id: 2, name: "Studio Two", city: "San Jose" },
];

const dummySpecialists = [
  {
    id: 1,
    name: "Specialist One",
    intro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    userId: 1,
    studioId: 1,
    availibilities: [4, 6],
  },
  {
    id: 2,
    name: "Specialist Two",
    intro:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    userId: 2,
    studioId: 1,
    availibilities: [2, 3],
  },
  {
    id: 3,
    intro:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
    name: "Specialist Three",
    userId: 3,
    studioId: 2,
    availibilities: [0, 1, 2],
  },
];

const dummyAppointments = [
  { id: 1, customerId: 1, studioId: 1, specialistId: 1 },
];

const BookingPage = () => {
  const [customers, setCustomers] = useState([]);
  const [studios, setStudios] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedFilterDay, setSelectedFilterDay] = useState();
  const [specialists, setSpecialists] = useState([]);
  const [selectedManagerSpecialistStudio, setSelectedManagerSpecialistStudio] =
    useState("");
  const [selectedManagerSpecialistUser, setSelectedManagerSpecialistUser] =
    useState("");
  const [managerSpecialistUserName, setManagerSpecialistUserName] =
    useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newStudioName, setNewStudioName] = useState("");
  const [newSpecialistName, setNewSpecialistName] = useState("");

  useEffect(() => {
    // Load studios (dummy data)
    setCustomers(dummyUsers);
    setStudios(dummyStudios);
    setSpecialists(dummySpecialists);
    setAppointments(dummyAppointments);
  }, []);

  const handleStudioSpecialistAdd = () => {
    if (!selectedManagerSpecialistUser) {
      alert("plaese select a user");
      return;
    }

    if (!selectedManagerSpecialistStudio) {
      alert("plaese select a studio");
      return;
    }

    if (!managerSpecialistUserName) {
      alert("need user name");
      return;
    }

    setSpecialists([
      ...specialists,
      {
        id: specialists[specialists.length - 1].id + 1,
        name: managerSpecialistUserName,
        userId: selectedManagerSpecialistUser,
        studioId: selectedManagerSpecialistStudio,
      },
    ]);
  };

  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
    // Filter Specialists based on the selected studio
    // const filteredSpecialists = dummySpecialists.filter(
    //   (Specialist) => Specialist.studioId === parseInt(studioId)
    // );
    // setSpecialists(filteredSpecialists);
  };

  const handleStudioChange = (studioId) => {
    setSelectedStudio(studioId);
    if (!studioId) {
      setSpecialists(dummySpecialists);
    } else {
      // Filter Specialists based on the selected studio
      const filteredSpecialists = dummySpecialists.filter(
        (Specialist) => Specialist.studioId === parseInt(studioId)
      );
      setSpecialists(filteredSpecialists);
    }
  };

  const handleNewCustomerAdd = () => {
    if (!newCustomerName) {
      alert("please enter new customer name");
      return;
    }
    setCustomers([
      ...customers,
      {
        id: customers[customers.length - 1].id + 1,
        name: newCustomerName,
      },
    ]);
    setNewCustomerName("");
  };

  const handleNewStudioAdd = () => {
    if (!newStudioName) {
      alert("please enter new customer name");
      return;
    }
    setStudios([
      ...studios,
      {
        id: studios[studios.length - 1].id + 1,
        name: newStudioName,
      },
    ]);
    setNewStudioName("");
  };

  const handleBooking = () => {
    // validating the data
    if (!selectedCustomer) {
      alert("please select customer");
      return;
    }
    if (!selectedStudio) {
      alert("please select studio");
      return;
    }
    if (!selectedSpecialist) {
      alert("please select specialist");
      return;
    }
    if (!bookingDate) {
      alert("please select bookingDate");
      return;
    }
    // Here you can add logic to handle the booking
    setAppointments([
      {
        id: appointments[0].id + 1,
        customerId: selectedCustomer,
        studioId: selectedStudio,
        specialistId: selectedSpecialist,
        date: bookingDate,
        time: bookingTime,
      },
      ...appointments,
    ]);
    // Clear the form
    setSelectedCustomer(null);
    setSelectedStudio(null);
    setSelectedSpecialist(null);

    setBookingDate("");
    setBookingTime("");
  };

  const handleFilterSpecilistAvailibilitiesChange = (v) => {
    console.log("handleFilterSpecilistAvailibilitiesChange", v);
    setSelectedFilterDay(v);
    console.log();
    setSpecialists(
      dummySpecialists.filter((s) => s.availibilities.includes(Number(v)))
    );
  };

  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-4 grid-xs-cols-1">
        <div>
          <h2 className="text-2xl">Administration</h2>
          <p className="text-gray-400">
            This administration could be used for internal mangament or support
            assistant
          </p>
          <h3 className="text-xl">Customers</h3>
          <p>User as customer</p>
          <label className="block w-80">
            <span className="text-gray-700">customer name</span>
            <input
              value={newCustomerName}
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
          </label>
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 my-3"
            onClick={handleNewCustomerAdd}
          >
            Add
          </button>
          <pre className="text-gray-400">
            {JSON.stringify(customers, null, 2)}
          </pre>
          <h2 className="text-xl mt-4">Studios</h2>
          <label className="block w-80">
            <span className="text-gray-700">studio name</span>
            <input
              value={newStudioName}
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setNewStudioName(e.target.value)}
            />
          </label>

          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 my-3"
            onClick={handleNewStudioAdd}
          >
            Add
          </button>
          <pre className="text-gray-400">
            {JSON.stringify(studios, null, 2)}
          </pre>
          <h2 className="text-xl mt-4">Specialist</h2>
          <label className="block">
            <span className="text-gray-700">select studio</span>
            <select
              onChange={(e) =>
                setSelectedManagerSpecialistStudio(e.target.value)
              }
              value={selectedManagerSpecialistStudio || ""}
              className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select</option>
              {studios.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">select user</span>
            <select
              onChange={(e) => setSelectedManagerSpecialistUser(e.target.value)}
              value={selectedManagerSpecialistUser || ""}
              className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select</option>
              {customers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block w-80">
            <span className="text-gray-700">specialist name</span>
            <input
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setManagerSpecialistUserName(e.target.value)}
            />
          </label>
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 my-3"
            onClick={handleStudioSpecialistAdd}
          >
            Add
          </button>
          <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(specialists, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-2xl">Book a Specialist</h2>
          <p className="text-gray-400">
            This section would be used for a customer to book specialists
          </p>
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">Your identity</span>
              <select
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => handleCustomerChange(e.target.value)}
                value={selectedCustomer || ""}
              >
                <option value="">Select</option>
                {customers.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name}
                  </option>
                ))}
              </select>
            </label>
            <hr />
            <label className="block">
              <div className="text-gray-700">
                Filtered by Specialist's Availibilities
              </div>
              <div className="text-gray-400">
                Product should use multi selector, use single selector here for
                quick demo purpose.
              </div>
              <select
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) =>
                  handleFilterSpecilistAvailibilitiesChange(e.target.value)
                }
                value={selectedFilterDay || ""}
              >
                <option value="">Select</option>
                {days.map((d, idx) => (
                  <option key={d} value={idx}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Filtered by Studio Location</span>
              <select
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => handleStudioChange(e.target.value)}
                value={selectedStudio || ""}
              >
                <option value="">Select</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name}, {studio.city}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Select Specialist</span>
              <select
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                value={selectedSpecialist || ""}
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select</option>
                {specialists.map((Specialist) => (
                  <option key={Specialist.id} value={Specialist.id}>
                    {Specialist.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              {specialists.map((row, rkey) => (
                <ProfileCard key={rkey} profile={row} />
              ))}
            </div>
            <div>
              {/* <table className="table-auto border-collapse">
                <thead>
                  <tr>
                    {Object.keys(dummySpecialists[0]).map((title, idx) => (
                      <th className="" key={idx}>
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specialists.map((row, rkey) => (
                    <tr key={rkey}>
                      {Object.keys(row).map((rname, ckey) => (
                        <td className="px-6 py-3" key={ckey}>
                          {rname === "availibilities"
                            ? row[rname].join(", ")
                            : row[rname]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table> */}
            </div>
            <label className="block">
              <span className="text-gray-700">Select Date</span>
              <input
                type="date"
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Select Date</span>
              <input
                type="time"
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </label>
          </div>
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 my-3"
            onClick={handleBooking}
          >
            Book
          </button>
        </div>
        <div className="col-span-1">
          <h2 className="text-2xl mb-2">Appointment View</h2>
          {appointments.map((apt, key) => (
            <div key={key}>{JSON.stringify(apt)}</div>
          ))}
          <ReleaseLog />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
