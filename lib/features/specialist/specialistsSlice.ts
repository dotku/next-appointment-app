import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchSpecialists } from "./specialistsAPI";

// A mock function to mimic making an async request for data
export const dummySpecialists = [
  { id: 1, customerId: 1, studioId: 1, specialistId: 1 },
];

export type Specialist = (typeof dummySpecialists)[0];

export interface SpecialistsSliceState {
  value: Specialist[];
  status: "idle" | "loading" | "failed";
}

const initialState = {
  value: dummySpecialists,
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const appointmentsSlice = createAppSlice({
  name: "specialists",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (creator) => ({
    createSpecialist: creator.reducer(
      (state, action: PayloadAction<Specialist>) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value.unshift(action.payload);
      }
    ),
    removeSpecialist: creator.reducer(
      (state, action: PayloadAction<{ id: number }>) => {
        state.value = state.value.filter(
          (item) => item.id === action.payload.id
        );
      }
    ),
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    updateSpecialists: creator.reducer(
      (state, action: PayloadAction<Specialist>) => {
        const updatedSpecialists = state.value.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        return { ...state, value: updatedSpecialists };
      }
    ),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    updatedSpecialistsAsync: creator.asyncThunk(
      async (appointments: Specialist[]) => {
        const response = await fetchSpecialists(appointments);
        // The value we return becomes the `fulfilled` action payload
        console.log("updatedSpecialistsAsync", response);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<Specialist[]>) => {
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
    selectSpecialists: (state) => state.value,
    selectSpecialistsStatus: (state) => state.status,
  },
});

// Action creators are generated for each case reducer function.
export const { createSpecialist, removeSpecialist, updatedSpecialistsAsync } =
  appointmentsSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSpecialists, selectSpecialistsStatus } =
  appointmentsSlice.selectors;
