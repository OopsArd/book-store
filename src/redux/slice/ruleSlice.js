import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRules = createAsyncThunk('rules/fetchRules', async () => {
    const respon = await axios.get(`http://localhost:8080/api/v1/rules`);
    const data = await respon.data.data.map((rule, index) => {
        return {
            id: rule.id,
            rule_name: rule.rule_name,
            value: Number(rule.value),
            is_use: String(rule.is_use),
            description: rule.description,
            key: index
        }
    });
    return data;
});
export const changeRules = createAsyncThunk('rules/changeRules', async (value) => {
    let dataToServer = JSON.stringify(value);
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/rules',
        headers:{
        'Content-Type': 'application/json'
        },
        data: dataToServer
    };
    const repos = await axios.request(config)
    const data = await repos.data.data;
    console.log("data rpos: ", data)
    let rs = {
        id: data.id,
        rule_name: data.rule_name,
        value: Number(data.value),
        is_use: String(data.is_use),
        description: data.description,
        key: Number(data.id) - 1
    }
    return rs;
});

const ruleSlice = createSlice({
    name: 'rules',
    initialState: {
        rules: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRules.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRules.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.rules = action.payload;
            })
            .addCase(fetchRules.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(changeRules.fulfilled, (state, action) => {
                console.log("action: ", action.payload);
                let updatedArray = state.rules.map(item => (item.id == action.payload.id ? { ...item, ...action.payload } : item));
                console.log('update arr: ', updatedArray)
                state.rules = updatedArray;
                console.log("stat change: ", state.rules)
            })
    }
})

export default ruleSlice.reducer