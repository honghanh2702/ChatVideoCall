import { configureStore } from "@reduxjs/toolkit";


import UserReducer from "../features/Table/UserSlice";


const rootReducer = {
  User: UserReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
