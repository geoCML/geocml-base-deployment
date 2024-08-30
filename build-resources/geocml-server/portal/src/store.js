import { configureStore } from "@reduxjs/toolkit";
import appReducter from "./app-slice";

export default configureStore({
  reducer: {
    app: appReducter,
  },
});
