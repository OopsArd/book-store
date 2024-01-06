import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slice/bookSlice";
import ruleReducer from "./slice/ruleSlice";
import customerReducer from "./slice/customerSlice";


const store = configureStore({
    reducer: {
      books: bookReducer,
      rules: ruleReducer,
      customers: customerReducer,
    },
});
  
export default store;