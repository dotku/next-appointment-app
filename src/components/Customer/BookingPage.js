"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProfileCard from "../Elements/ProfileCard";
import BusinessCard from "../Elements/BusinessCard";
import { days } from "../Elements/Calendar";
import supabase from "@/src/services/supabase";
import { useAppSelector, useAppDispatch } from "@/src/lib/hooks";
import {
  createUser,
  updateUsersAsync,
} from "@/src/lib/features/users/usersSlice";
import StateViewer from "@/src/components/Admin/StateViewer";
import { selectBusinesses } from "@/src/lib/features/businesses/businessesSlice";
import {
  selectAppointments,
  selectAppointmentsStatus,
  updateAppointmentsAsync,
} from "@/src/lib/features/appointments/appointmentsSlice";
import {
  selectSpecialists,
  updateSpecialistsAsync,
  setSpecialists,
} from "@/src/lib/features/specialist/specialistsSlice";
import { setBusinesses } from "@/src/lib/features/businesses/businessesSlice";

const BookingPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const businesses = useAppSelector(selectBusinesses); // Filtered results for display
  const appointmentsStatus = useAppSelector(selectAppointmentsStatus);
  const appointments = useAppSelector(selectAppointments);
  const specialists = useAppSelector(selectSpecialists);
  const [customers, setCustomers] = useState(users.value);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedFilterDay, setSelectedFilterDay] = useState();
  const [allBusinesses, setAllBusinesses] = useState([]); // All businesses for dropdown
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

  // Load all businesses for dropdown
  const loadAllBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*');
      
      if (error) {
        console.error('Load all businesses error:', error);
      } else {
        setAllBusinesses(data || []);
      }
    } catch (error) {
      console.error('Load all businesses error:', error);
    }
  };

  // Search function that uses current filter state
  const performSearch = useCallback(async () => {
    try {
      // Build businesses query
      let businessesQuery = supabase.from('businesses').select('*');
      if (selectedStudio) {
        businessesQuery = businessesQuery.eq('id', selectedStudio);
      }
      
      const { data: businessesData, error: businessesError } = await businessesQuery;
      
      if (businessesError) {
        console.error('Businesses search error:', businessesError);
        return;
      }

      // Build specialists query
      let specialistsQuery = supabase
        .from('specialists')
        .select('*, businesses:business_id (name, city, address)');
      
      if (selectedStudio) {
        specialistsQuery = specialistsQuery.eq('business_id', selectedStudio);
      }
      
      // Filter by day availability (only if a valid day is selected)
      if (selectedFilterDay !== null && selectedFilterDay !== undefined && selectedFilterDay !== "") {
        const dayNum = parseInt(selectedFilterDay);
        if (!isNaN(dayNum)) {
          specialistsQuery = specialistsQuery.contains('availabilities', [dayNum]);
        }
      }

      const { data: specialistsData, error: specialistsError } = await specialistsQuery;
      
      if (specialistsError) {
        console.error('Specialists search error:', specialistsError);
        return;
      }
      
      console.log('Search results:', { businesses: businessesData, specialists: specialistsData });
      
      // Update Redux store
      dispatch(setBusinesses(businessesData || []));
      dispatch(setSpecialists(specialistsData || []));
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [selectedStudio, selectedFilterDay, dispatch]);

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
        !ifFound &&
          dispatch(
            updateUsersAsync([
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
    // Load all businesses for dropdown
    loadAllBusinesses();
    
    // Initial search with current filters
    const performInitialSearch = async () => {
      try {
        // Build businesses query
        let businessesQuery = supabase.from('businesses').select('*');
        
        const { data: businessesData, error: businessesError } = await businessesQuery;
        
        if (businessesError) {
          console.error('Businesses search error:', businessesError);
          return;
        }

        // Build specialists query
        let specialistsQuery = supabase
          .from('specialists')
          .select('*, businesses:business_id (name, city, address)');

        const { data: specialistsData, error: specialistsError } = await specialistsQuery;
        
        if (specialistsError) {
          console.error('Specialists search error:', specialistsError);
          return;
        }
        
        console.log('Initial search results:', { businesses: businessesData, specialists: specialistsData });
        
        // Update Redux store
        dispatch(setBusinesses(businessesData || []));
        dispatch(setSpecialists(specialistsData || []));
      } catch (error) {
        console.error('Initial search error:', error);
      }
    };
    
    performInitialSearch();
  }, []);

  // Re-search when filters change (with debounce)
  const debounceTimerRef = useRef(null);
  
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer - use the performSearch function directly
    debounceTimerRef.current = setTimeout(() => {
      performSearch();
    }, 300); // 300ms debounce
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedFilterDay, selectedStudio, performSearch]);

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
    // Refresh search after adding specialist
    performSearch();
  };

  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
  };

  const handleStudioChange = (businessId) => {
    // Convert empty string to null
    setSelectedStudio(businessId === "" ? null : businessId);
    // No longer using dummy data, will trigger API call in useEffect
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
    dispatch(
      updateAppointmentsAsync([
        {
          id: appointments[0].id + 1,
          customerId: selectedCustomer,
          specialistId: selectedSpecialist,
          date: new Date(bookingDate),
          time: bookingTime,
        },
        ...appointments,
      ])
    );
    // Clear the form
    // setSelectedCustomer(null);
    // setSelectedStudio(null);
    // setSelectedSpecialist(null);

    // setBookingDate("");
    // setBookingTime("");
  };

  const handleFilterSpecilistAvailibilitiesChange = (v) => {
    console.log("handleFilterSpecilistAvailibilitiesChange", v);
    // Convert empty string to null (same as handleStudioChange)
    setSelectedFilterDay(v === "" ? null : v);
    // No longer using dummy data, will trigger API call in useEffect
  };

  return (
    <div className="grid lg:grid-cols-4 gap-4 grid-xs-cols-1">
      <div className="col-span-1">
        <h2 className="text-2xl">Filters</h2>
        <div className="text-gray-700">
          Filtered by Specialist's Availibilities
        </div>
        <div className="block mt-4">
          <label className="block mt-4">
            <span className="text-gray-700">Select Day</span>
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
            <span className="text-gray-700">Select Date</span>
            <input
              type="date"
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </label>
          <label className="block mt-4">
            <span className="text-gray-700">Select Time</span>
            <input
              type="time"
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-gray-700">Filtered by Studio Location</span>
          <select
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => handleStudioChange(e.target.value)}
            value={selectedStudio || ""}
          >
            <option value="">Select</option>
            {allBusinesses.map((business) => (
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
          
          {/* Display Salons */}
          {businesses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Salons ({businesses.length})
              </h3>
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}

          {/* Display Specialists */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Specialists ({specialists.length})
            </h3>
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
          disabled={appointmentsStatus === "loading"}
        >
          Book
        </button>
      </div>
      <StateViewer />
    </div>
  );
};

export default BookingPage;
