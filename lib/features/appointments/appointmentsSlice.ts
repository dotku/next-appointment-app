import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchAppointments } from "./appointmentsAPI";
import { getLocalTimeZone, today } from "@internationalized/date";

// A mock function to mimic making an async request for data
export const dummyAppointments = [
  {
    id: 1,
    customerId: 1,
    businessId: 1,
    specialistId: 1,
    // date: today(getLocalTimeZone()).add({ days: 5 }).toString(),
    date: today(getLocalTimeZone()).add({ days: 5 }).toDate("PST"),
  },
];

export type Appointment = (typeof dummyAppointments)[0];

export interface AppointmentsSliceState {
  value: Appointment[];
  status: "idle" | "loading" | "failed";
}

const initialState = {
  value: dummyAppointments,
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const appointmentsSlice = createAppSlice({
  name: "appointments",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (creator) => ({
    createAppointment: creator.reducer(
      (state, action: PayloadAction<Appointment>) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value.unshift(action.payload);
      }
    ),
    removeAppointment: creator.reducer(
      (state, action: PayloadAction<{ id: number }>) => {
        state.value = state.value.filter(
          (item) => item.id === action.payload.id
        );
      }
    ),
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    updateAppointments: creator.reducer(
      (state, action: PayloadAction<Appointment>) => {
        const updatedAppointments = state.value.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        return { ...state, value: updatedAppointments };
      }
    ),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    updatedAppointmentsAsync: creator.asyncThunk(
      async (appointments: Appointment[]) => {
        const response = await fetchAppointments(appointments);
        // The value we return becomes the `fulfilled` action payload
        console.log("updatedAppointmentsAsync", response);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<Appointment[]>) => {
          state.status = "idle";
          state.value = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectAppointments: (state) => state.value,
    selectAppointmentsStatus: (state) => state.status,
  },
});

// Action creators are generated for each case reducer function.
export const {
  createAppointment,
  removeAppointment,
  updatedAppointmentsAsync,
} = appointmentsSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAppointments, selectAppointmentsStatus } =
  appointmentsSlice.selectors;
