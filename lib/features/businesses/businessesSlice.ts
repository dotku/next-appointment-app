import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchCompanies } from "./businessesAPI";

// A mock function to mimic making an async request for data
export const dummyBusinesses = [
  { id: 1, name: "Studio One", city: "San Francisco" },
  { id: 2, name: "Studio Two", city: "San Jose" },
];

export type Business = (typeof dummyBusinesses)[0];

export interface CompaniesSliceState {
  value: Business[];
  status: "idle" | "loading" | "failed";
}

const initialState = {
  value: dummyBusinesses,
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const businessesSlice = createAppSlice({
  name: "busineses",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (creator) => ({
    createBusiness: creator.reducer(
      (state, action: PayloadAction<Business>) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value.unshift(action.payload);
      }
    ),
    removeBusiness: creator.reducer(
      (state, action: PayloadAction<{ id: number }>) => {
        state.value = state.value.filter(
          (item) => item.id === action.payload.id
        );
      }
    ),
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    updateCompanies: creator.reducer(
      (state, action: PayloadAction<Business>) => {
        const updatedCompanies = state.value.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        return { ...state, value: updatedCompanies };
      }
    ),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    updateBuinessesAsync: creator.asyncThunk(
      async (appointments: Business[]) => {
        const response = await fetchCompanies(appointments);
        // The value we return becomes the `fulfilled` action payload
        console.log("updatedCompaniesAsync", response);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<Business[]>) => {
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
    selectBusinesses: (state) => state.value,
    selectBusinessesStatus: (state) => state.status,
  },
});

// Action creators are generated for each case reducer function.
export const { createBusiness, removeBusiness, updateBuinessesAsync } =
  businessesSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectBusinesses, selectBusinessesStatus } =
  businessesSlice.selectors;
