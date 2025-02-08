import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { formatMessageTime } from "../lib/utils";
import { useSelector,useDispatch } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import { getMessagesFailure,getMessagesStart,getMessagesSuccess } from "../store/chatSlice.js";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages=[],
    isMessagesLoading,
    selectedUser,
  } = useSelector(state=>state.chat);
  const { authUser } = useSelector(state=>state.user);
  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {

    const getMessages = async()=>{
      if (!selectedUser?._id) return;
      try {
          dispatch(getMessagesStart());
          const res=await axiosInstance.get(`/messages/${selectedUser._id}`);
          dispatch(getMessagesSuccess(res.data));
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching messages");
        dispatch(getMessagesFailure(error.response?.data?.message));
      }

    }

    getMessages();

    // subscribeToMessages();

    // return () => unsubscribeFromMessages();
  }, [selectedUser._id,dispatch]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null} // Only add ref to last message
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;