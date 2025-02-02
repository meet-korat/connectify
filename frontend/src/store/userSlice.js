import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {

    currentUser: null,
    IsAuthenticated: false,
    IsSigningup:false,
    IsCheckingAuth:false,
    IsLoading:false,
    IsSigningin:false,
}

export const userSlice=createSlice({
    name:"user",

    initialState,
    reducers:{
        checkAuthStart:(state)=>{
            state.IsCheckingAuth=true;
            state.IsLoading=true;
        },     
        checkAuthSuccess:(state)=>{
            state.IsCheckingAuth=false;
            state.IsAuthenticated=true;
            state.IsLoading=false;
        },
        checkAuthFailure:(state)=>{
            state.IsCheckingAuth=false;
            state.IsAuthenticated=false;
            state.IsLoading=false;  
        },
        loginStart:(state)=>{
            state.IsSigningin=true;
            state.IsLoading=true;

        },
        loginSuccess:(state,action)=>{
            state.IsSigningin=false;
            state.currentUser=action.payload;
            state.IsAuthenticated=true;
            state.IsLoading=false;
            toast.success("Logged in successfully");
        },
        loginFailure:(state)=>{
            state.currentUser=null;
            state.IsAuthenticated=false;
            state.IsSigningin=false;
            state.IsLoading=false;
            toast.error("Something went wrong in login");
        },
        logout:(state)=>{
            state.IsAuthenticated=false;
            state.currentUser=null;
        },
        signUpStart: (state) => {
          state.IsSigningup=true;
          state.IsLoading=true;
        },
        signUpSuccess: (state, action) => {
          state.IsSigningup=false;
          state.currentUser = action.payload;
          state.IsAuthenticated = true;
          state.IsLoading=false;
          toast.success("Account created successfully");

        },
        signUpFailure: (state) => {
          state.currentUser = null;
          state.IsAuthenticated = false;
          state.IsSigningup=false;
          toast.error("Something went wrong in signup");
        },
        
    },
});

export const {logout,signUpFailure,signUpStart,signUpSuccess,checkAuthFailure,checkAuthStart,checkAuthSuccess,loginFailure,loginStart,loginSuccess}=userSlice.actions;

export default userSlice.reducer;