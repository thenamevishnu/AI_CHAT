import { createSlice } from "@reduxjs/toolkit";
import { models } from "../constants/models";

const modelSlice = createSlice({
    name: 'model',
    initialState: {
        model: models[0]
    },
    reducers: {
        setModel: (state, action) => {
            state.model = action.payload;
        }
    }
})

export const { setModel } = modelSlice.actions;
export const { reducer: modelReducer } = modelSlice