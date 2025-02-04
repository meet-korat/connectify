import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userSlice.js";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}
 const persistedReducer = persistReducer(persistConfig, userReducer);

const store=configureStore({
    reducer:{
        user:persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            },
        })
})

export const persistor = persistStore(store);

export default store;

