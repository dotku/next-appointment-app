import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchSpecialists } from "./specialistsAPI";

// A mock function to mimic making an async request for data
export const dummyAppointments = [
  { id: 1, customerId: 1, businessId: 1, specialistId: 1 },
];

export const dummySpecialists = [
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

export type Specialist = (typeof dummySpecialists)[0];

export interface SpecialistsSliceState {
  value: Specialist[];
  status: "idle" | "loading" | "failed";
}

const initialState = {
  value: dummySpecialists,
  filter: {
    keywords: "",
  },
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const specialistsSlice = createAppSlice({
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
    updateSpecialistsFilter: creator.reducer(
      (state, action: PayloadAction<{ keywords: string }>) => {
        console.log("updateSpecialistsFilter");
        const newFilter = {
          ...state.filter,
          ...action.payload,
        };

        state.filter = newFilter;
        console.log("state.value", state.value);
        // keywords search
        // @todo could use AI for suggestion
        state.value = dummySpecialists.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(newFilter.keywords.toLowerCase()) ||
            item.intro.toLowerCase().includes(newFilter.keywords.toLowerCase())
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
    updateSpecialistsAsync: creator.asyncThunk(
      async (appointments: Specialist[]) => {
        const response = await fetchSpecialists(appointments);
        // The value we return becomes the `fulfilled` action payload
        console.log("updateSpecialistsAsync", response);
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
export const {
  createSpecialist,
  removeSpecialist,
  updateSpecialistsAsync,
  updateSpecialistsFilter,
} = specialistsSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSpecialists, selectSpecialistsStatus } =
  specialistsSlice.selectors;
