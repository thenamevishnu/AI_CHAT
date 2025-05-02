import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: []
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = [...state.chats, ...action.payload]
        },
        removeChats: (state, action) => {
            state.chats = state.chats.filter(chat => chat.chat_id != action.payload)
        }
    }
})

export const { setChats, removeChats } = chatSlice.actions;
export const { reducer: chatReducer } = chatSlice;