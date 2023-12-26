import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRules = createAsyncThunk('books/fetchRules', async () => {
    const respon = await axios.get(`http://localhost:8080/api/v1/rules`);
    const data = await respon.data.data.map((rule, index) => {
        return {
            id: rule.id,
            rule_name: rule.rule_name,
            value: rule.value,
            is_use: String(rule.is_use),
            description: rule.description,
            key: index
        }
    });
    return data;
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
            });
    }
})

export default ruleSlice.reducer