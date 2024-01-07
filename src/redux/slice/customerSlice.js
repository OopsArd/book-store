import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
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

export const addCustomer = createAsyncThunk('customers/addCustomer', async (value) => {
    let dataToServer = JSON.stringify(value);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/v1/customers',
      headers:{
        'Content-Type': 'application/json'
      },
      data: dataToServer
    };

    const repos = await axios.request(config);
    const data = await repos.data.data;
    const rs = {
        id: data.id,
        full_name: data.full_name,
        address: data.address,
        phone_no: data.phone_no,
        email: data.email,
        debt_no: data.debt_no,
        balance: data.balance,
    }
    console.log("rs: ")
    return rs
});
export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (value) => {
    const respon = await axios.get(`http://localhost:8080/api/v1/customers/${value}`);
    const data = await respon.data.data;
    const rs = {
        id: data.id,
        full_name: data.full_name,
        address: data.address,
        phone_no: data.phone_no,
        email: data.email,
        debt_no: data.debt_no,
        balance: data.balance,
    }
    console.log("rs new: ", rs);
    return rs
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
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                const newArr = state.customers.map(item => item.id == action.payload.id ? {...item, ...action.payload} : item);
                state.customers = newArr;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const newArr = state.customers.map(item => item.id == action.payload.id ? {...item, ...action.payload} : item);
                console.log("new arr: ", newArr)
                state.customers = newArr;
            })
    }
})

export default customerSlice.reducer