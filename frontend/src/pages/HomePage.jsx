import Sidebar from "../components/sidebar.jsx";
import {NoChatSelected} from "../components/NoChatSelected.jsx";
import {ChatContainer} from "../components/ChatContainer.jsx";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useDispatch,useSelector } from "react-redux";
import { getUserFailure,getUserStart,getUserSuccess } from "../store/chatSlice.js";
import { getMessagesStart,getMessagesFailure,getMessagesSuccess } from "../store/chatSlice.js";
const HomePage = () => {
  // const { selectedUser } = useChatStore();
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.chat);
  // const{users}=useSelector((state)=>state.chat.users);
  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(getUserStart());
        const res = await axiosInstance.get("/messages/users");
        dispatch(getUserSuccess(res.data));
      } catch (error) {
        dispatch(getUserFailure(error.response?.data?.message || "Error fetching users"));
      }
    };

    const getMessages = async()=>{
      if (!selectedUser?._id) return;
      try {
        dispatch(getMessagesStart());
        const res=await axiosInstance.get(`/messages/${selectedUser._id}`);
        dispatch(getMessagesSuccess(res.data));
      } catch (error) {
        dispatch(getMessagesFailure(error.response?.data?.message));
      }
    };

    getUser();
    getMessages();

  }, [dispatch,selectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            {/* {}
            <ChatContainer />
            <NoChatSelected/> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;