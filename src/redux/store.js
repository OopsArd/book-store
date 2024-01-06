import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slice/bookSlice";
import ruleReducer from "./slice/ruleSlice";
import customerReducer from "./slice/customerSlice";
import reportReducer from "./slice/reportSlice";


const store = configureStore({
    reducer: {
      books: bookReducer,
      rules: ruleReducer,
      customers: customerReducer,
      reports: reportReducer,
    },
});
  
export default store;