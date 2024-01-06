import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCustomers = createAsyncThunk('books/fetchCustomers', async () => {
    const respon = await axios.get(`http://localhost:8080/api/v1/customers`);
    const data = await respon.data.data.map((cus, index) => {
        return {
            id: cus.id,
            full_name: cus.full_name,
            address: cus.address,
            phone_no: cus.phone_no,
            email: cus.email,
            debt_no: cus.debt_no,
            balance: cus.balance,
            key: index
        }
    });
    return data;
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

export default customerSlice.reducer