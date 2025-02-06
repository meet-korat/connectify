import { createSlice } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

const initialState={
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
}

export const chatSlice=createSlice({
    name:"chat",
    initialState,
    reducers:{
        getUserStart:(state)=>{
            state.isUserLoading=true;
        },
        getUserSuccess:(state,action)=>{
            state.users=action.payload;
            state.isUserLoading=false;
        },
        getUserFailure:(state)=>{
            state.isUserLoading=false;
        },
        getMessagesStart:(state)=>{
            state.isMessagesLoading=true;
        },
        getMessagesSuccess:(state,action)=>{
            state.messages=action.payload;
            state.isMessagesLoading=false;
        },
        getMessagesFailure:(state)=>{
            state.isMessagesLoading=false;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        }
    }
})

export const {setSelectedUser,getUserStart,getUserSuccess,getUserFailure,getMessagesStart,getMessagesSuccess,getMessagesFailure}=chatSlice.actions;
export default chatSlice.reducer;