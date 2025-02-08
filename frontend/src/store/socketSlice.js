import { createSlice } from "@reduxjs/toolkit";
const BASE_URL= "http://localhost:5001";
const socketSlice = createSlice({
    name:"socket",
    initialState:{
        socket:null,
        onlineUsers:[],
    },
    reducers:{
        setSocket:(state,action)=>{
            state.socket=action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload;
        }
    }

});

export const {setSocket,setOnlineUsers}=socketSlice.actions;    
// export default socketSlice.reducer;
export const connectSocket=()=>(dispatch,getState)=>{
    const {auth:{user},socket:{socket}}=getState();

    if(!user || socket?.connected) return;

    const newSocket=io(BASE_URL,{
        query:{
            userId:authUser._id,
        }

    });
    newSocket.connect();
    dispatch(setSocket(newSocket));

    newSocket.on("getOnlineUsers",(userIds)=>{
        dispatch(setOnlineUsers(userIds));
    });
};

export const disconnectSocket = () => (dispatch, getState) => {
    const { socket: { socket } } = getState();
    if (socket?.connected) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  };
  

export default socketSlice.reducer;