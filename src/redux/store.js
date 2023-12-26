import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slice/bookSlice";
import ruleReducer from "./slice/ruleSlice";


const store = configureStore({
    reducer: {
      books: bookReducer,
      rules: ruleReducer,
    },
});
  
export default store;