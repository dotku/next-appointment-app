"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "../Elements/ProfileCard";
import { days } from "../Elements/Calendar";
import supabase from "src/services/supabase";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/store/store";
import { createUser, updatedUsersAsync } from "@/lib/features/users/usersSlice";
import StateViewer from "@/src/components/Admin/StateViewer";
import { selectBusinesses } from "@/lib/features/businesses/businessesSlice";

const dummySpecialists = [
  {
    id: 1,
    name: "Specialist One",
    intro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    userId: 1,
    businessId: 1,
    availibilities: [4, 6],
  },
  {
    id: 2,
    name: "Specialist Two",
    intro:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    userId: 2,
    businessId: 1,
    availibilities: [2, 3],
  },
  {
    id: 3,
    intro:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
    name: "Specialist Three",
    userId: 3,
    businessId: 2,
    availibilities: [0, 1, 2],
  },
];

const dummyAppointments = [
  { id: 1, customerId: 1, businessId: 1, specialistId: 1 },
];

const BookingPage = () => {
  const users = useAppSelector((state) => state.users);
  const businesses = useAppSelector(selectBusinesses);
  const dispatch = useAppDispatch();
  const [customers, setCustomers] = useState(users.value);
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
    // Check current session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("session", session);
      if (session) {
        const { user } = session;
        const ifFound = users.value.find((v) => v.id === user.id);
        //   { id: 3, name: "User Three" },
        !ifFound &&
          dispatch(
            updatedUsersAsync([
              ...users.value,
              {
                id: user.id,
                name: user.email,
              },
            ])
          );
        setSelectedCustomer(user.id);
      }
    };

    getSession();
    // Load businesses (dummy data)
    // setCustomers(users);
    setSpecialists(dummySpecialists);
    setAppointments(dummyAppointments);
  }, []);

  const handleStudioSpecialistAdd = () => {
    if (!selectedManagerSpecialistUser) {
      alert("plaese select a user");
      return;
    }

    if (!selectedManagerSpecialistStudio) {
      alert("plaese select a business");
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
        businessId: selectedManagerSpecialistStudio,
      },
    ]);
  };

  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
    // Filter Specialists based on the selected business
    // const filteredSpecialists = dummySpecialists.filter(
    //   (Specialist) => Specialist.businessId === parseInt(businessId)
    // );
    // setSpecialists(filteredSpecialists);
  };

  const handleStudioChange = (businessId) => {
    setSelectedStudio(businessId);
    if (!businessId) {
      setSpecialists(dummySpecialists);
    } else {
      // Filter Specialists based on the selected business
      const filteredSpecialists = dummySpecialists.filter(
        (Specialist) => Specialist.businessId === parseInt(businessId)
      );
      setSpecialists(filteredSpecialists);
    }
  };

  const handleNewCustomerAdd = () => {
    if (!newCustomerName) {
      alert("please enter new customer name");
      return;
    }
    // setCustomers([
    //   ...customers,
    //   {
    //     id: customers[customers.length - 1].id + 1,
    //     name: newCustomerName,
    //   },
    // ]);
    dispatch(
      createUser({
        id: users.value.length + 1,
        name: newCustomerName,
      })
    );
    setNewCustomerName("");
  };

  const handleBooking = () => {
    // validating the data
    if (!selectedCustomer) {
      alert("please select customer");
      return;
    }
    // if (!selectedStudio) {
    //   alert("please select business");
    //   return;
    // }
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
        specialistId: selectedSpecialist,
        date: bookingDate,
        time: bookingTime,
      },
      ...appointments,
    ]);
    // Clear the form
    // setSelectedCustomer(null);
    // setSelectedStudio(null);
    // setSelectedSpecialist(null);

    // setBookingDate("");
    // setBookingTime("");
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
    <div className="grid lg:grid-cols-4 gap-4 grid-xs-cols-1">
      <div className="col-span-1">
        <h2 className="text-2xl">Filters</h2>
        <div className="text-gray-700">
          Filtered by Specialist's Availibilities
        </div>
        <label className="block mt-4">
          <label className="block">
            <span className="text-gray-700">Select Date</span>
            <input
              type="date"
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </label>
          <label className="block mt-4">
            <span className="text-gray-700">Select Date</span>
            <input
              type="time"
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </label>
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
        <label className="block mt-4">
          <span className="text-gray-700">Filtered by Studio Location</span>
          <select
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => handleStudioChange(e.target.value)}
            value={selectedStudio || ""}
          >
            <option value="">Select</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}, {business.city}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="col-span-2">
        <h2 className="text-2xl">Book a Specialist</h2>
        <p className="text-gray-400">
          This section would be used for a customer to book specialists
        </p>
        <div className="grid grid-cols-1 gap-6">
          {/* <label className="block">
            <span className="text-gray-700">Your identity</span>
            <select
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => handleCustomerChange(e.target.value)}
              value={selectedCustomer || ""}
            >
              <option value="">Select</option>
              {customers.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </label>
          <hr /> */}

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
        </div>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={handleBooking}
        >
          Book
        </button>
      </div>
      <div>
        <h2 className="text-2xl mb-2">Dashboard</h2>
        <StateViewer />
      </div>
    </div>
  );
};

export default BookingPage;
