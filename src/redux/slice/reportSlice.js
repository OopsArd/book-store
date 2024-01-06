import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";

export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
    const now = dayjs();
    const firstDayOfMonth = now.startOf('year').format('YYYY-MM-DD');
    const  today = now.format('YYYY-MM-DD');

    let dataBody = {
        start_date: firstDayOfMonth,
        end_date: today
    }

    console.log("data: ", dataBody)

    let dataToServer = JSON.stringify(dataBody);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:8080/api/v1/reports/books/inventory`,
        headers:{
            'Content-Type': 'application/json'
        },
        data: dataToServer
    };

    const rs = await axios.request(config);
    const data = await rs?.data?.data;

    const listRp = data?.map((item, index) => {
        return {
            ...item,
            key: index
        }
    })

    return listRp;
});

export const getReports = createAsyncThunk('reports/getReports', async (value) => {
    
    let reportTypes = value.url;
    let timeReport = {
        start_date: value.start_date,
        end_date: value.end_date
    }
    console.log("time 2: ", timeReport)
    let dataToServer = JSON.stringify(timeReport);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:8080/api/v1/reports/${reportTypes}`,
        headers:{
            'Content-Type': 'application/json'
        },
        data: dataToServer
    };

    const rs = await axios.request(config);
    console.log("rs 2: ", rs)
    const data = await rs?.data?.data;
    console.log("data 2: ", data)
    const listRp = data?.map((item, index) => {
        return {...item, key: index}
    })
    console.log("list: ", listRp)

    return listRp;
});

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        reports: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getReports.fulfilled, (state, action) => {
                state.reports = action.payload;
            })
    }
})

export default reportSlice.reducer