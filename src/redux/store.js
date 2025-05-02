import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { chatReducer } from "./chat.slice"
import { configureStore } from "@reduxjs/toolkit"
import { modelReducer } from "./model.slice"

const persistConfig = {
    chat: {
        key: "chat",
        storage
    },
    model: {
        key: "model",
        storage
    }
}

const persistedChatReducer = persistReducer(persistConfig.chat, chatReducer)
const persistedModelReducer = persistReducer(persistConfig.model, modelReducer)

export const store = configureStore({
    reducer: {
        chat: persistedChatReducer,
        model: persistedModelReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: ["persist/PERSIST"]
        }
    })
})

export const persistor = persistStore(store)