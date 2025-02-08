import { configureStore } from "@reduxjs/toolkit";
// import createSagaMiddleware from 'redux-saga'
import  userReducer  from "./userSlice.js";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from "redux";
import chatReducer from "./chatSlice.js";
import socketReducer from "./socketSlice.js";   
// import rootSaga from './sagas.js';

// const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    socket:socketReducer
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
// sagaMiddleware.run(rootSaga)
export const persistor = persistStore(store);

export default store;

