import { createSlice } from "@reduxjs/toolkit";

const initialState={
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
    isSending:false
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
        },
        sendMessageStart:(state)=>{
            state.isSending=true;
        },
        sendMessageSuccess:(state,action)=>{
            state.messages.push(action.payload);
            state.isSending=false;
        },
        sendMessageFailure:(state)=>{
            state.isSending=false;  
        }
    }
})

export const {sendMessageFailure,sendMessageStart,sendMessageSuccess,setSelectedUser,getUserStart,getUserSuccess,getUserFailure,getMessagesStart,getMessagesSuccess,getMessagesFailure}=chatSlice.actions;
export default chatSlice.reducer;