import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userSlice.js";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from "redux";
import chatReducer from "./chatSlice.js";

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
});

const persistConfig = {
    key: 'root',
    storage,
}
 const persistedReducer = persistReducer(persistConfig, rootReducer);

const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            },
        })
})

export const persistor = persistStore(store);

export default store;

