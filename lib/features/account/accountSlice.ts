import { createAppSlice } from "@/lib/createAppSlice";
import { fetchAccount } from "./accountAPI";

export interface Account {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact?: string;
  roles: string[];
}

export interface AccountSliceState {
  value?: Account;
  status: "idle" | "loading" | "failed";
}

const initialState: AccountSliceState = {
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const accountSlice = createAppSlice({
  name: "account",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    updateAccountAsync: create.asyncThunk(
      async (account: Account) => {
        const response = await fetchAccount(account);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
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
    selectAccount: (state) => state.value,
    selectStatus: (state) => state.status,
  },
});

// Action creators are generated for each case reducer function.
export const { updateAccountAsync } = accountSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAccount, selectStatus } = accountSlice.selectors;
