import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {

    currentUser: null,
    IsAuthenticated: false,
    IsSigningup:false,
     
}

export const userSlice=createSlice({
    name:"user",

    initialState,
    reducers:{
        login:(state,action)=>{
            state.IsAuthenticated=true;
            state.currentUser=action.payload;

        },
        logout:(state)=>{
            state.IsAuthenticated=false;
            state.currentUser=null;
        },
        signUpStart: (state) => {
          state.IsSigningup=true;
        },
        signUpSuccess: (state, action) => {
          state.IsSigningup=false;
          state.currentUser = action.payload;
          state.IsAuthenticated = true;
          toast.success("Account created successfully");

        },
        signUpFailure: (state) => {
          state.currentUser = null;
          state.IsAuthenticated = false;
          toast.error("Something went wrong in signup");
        },
        
    },
});

export const {login,logout,signUpFailure,signUpStart,signUpSuccess}=userSlice.actions;

export default userSlice.reducer;