import { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import {
  createUser,
  selectUsers,
  selectUsersStatus,
  updateUsersAsync,
} from "@/src/lib/features/users/usersSlice";
import { selectBusinesses } from "@/src/lib/features/businesses/businessesSlice";
import BusinessesAdmin from "./BusinessesAdmin";
import {
  selectSpecialists,
  updateSpecialistsAsync,
} from "@/src/lib/features/specialist/specialistsSlice";

const dummyAppointments = [
  { id: 1, customerId: 1, businessId: 1, specialistId: 1 },
];

export default function Admin() {
  const businesses = useAppSelector(selectBusinesses);
  const users = useAppSelector(selectUsers);
  const usersStatus = useAppSelector(selectUsersStatus);
  const specialists = useAppSelector(selectSpecialists);
  const dispatch = useAppDispatch();

  const [session, setSession] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [newCustomerName, setNewCustomerName] = useState("");
  const [selectedManagerSpecialistUser, setSelectedManagerSpecialistUser] =
    useState("");
  const [managerSpecialistUserName, setManagerSpecialistUserName] =
    useState("");
  const [selectedManagerSpecialistStudio, setSelectedManagerSpecialistStudio] =
    useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const setSpecialists = (specialists) => {
    dispatch(updateSpecialistsAsync(specialists));
  };

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("session", session);
      if (session) {
        const { user } = session;
        //   { id: 3, name: "User Three" },
        // setCustomers([
        //   ...users,
        //   {
        //     id: user.id,
        //     name: user.email,
        //   },
        // ]);
        setSelectedCustomer(user.id);
        setSession(session);
        dispatch(
          updateUsersAsync(
            users.map((u) => ({
              ...u,
              ownerId: user.id,
            }))
          )
        );
      }
    };

    getSession();
    // Load businesses (dummy data)
    setCustomers(users);
    setAppointments(dummyAppointments);
  }, []);

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
        id: users.length + 1,
        name: newCustomerName,
        ownerId: session.user.id,
      })
    );
    setNewCustomerName("");
  };

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

  return (
    <div className="mt-4">
      <h2 className="text-2xl">Administration</h2>
      <p className="text-gray-400">
        This administration could be used for internal mangament or support
        assistant
      </p>
      <div className="grid lg:grid-cols-3 gap-4 grid-xs-cols-1">
        <div>
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
            Create
          </button>
          <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
        <div>
          <BusinessesAdmin />
        </div>
        <div>
          <h2 className="text-xl mt-4">Specialist</h2>
          <label className="block">
            <span className="text-gray-700">select business</span>
            <select
              onChange={(e) =>
                setSelectedManagerSpecialistStudio(e.target.value)
              }
              value={selectedManagerSpecialistStudio || ""}
              className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select</option>
              {businesses.map((row) => (
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
            Create
          </button>
          <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(specialists, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
