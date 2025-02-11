import { createSlice } from "@reduxjs/toolkit";
import { addMessage } from "./chatSlice.js";
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
        },
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

export const subscribeToNewMessages=()=>(dispatch,getstate)=>{
    const {selectedUser:{selectedUser}}=getstate();
    if(!selectedUser) return;
    const {socket}=getstate();
    socket.on("newMessage",(newMessage)=>{
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if(!isMessageSentFromSelectedUser) return;
        const {messages:{messages}}=getstate();
        console.log("first",messages)
        dispatch(addMessage(messages));
    })
}  ;
export const unsubscribeFromMessages=()=>(getState)=>{
    const {socket:{socket}}=getState();
    socket.off("newMessage");
};

export default socketSlice.reducer;