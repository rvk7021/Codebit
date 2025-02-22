import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import profileReducer from "./Slices/ProfileSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile:profileReducer,
  },
});

export default store;
