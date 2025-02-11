import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { formatMessageTime } from "../lib/utils";
import { useSelector,useDispatch } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import { subscribeToNewMessages,unsubscribeFromMessages } from "../store/socketSlice.js";
import { getMessagesFailure,getMessagesStart,getMessagesSuccess } from "../store/chatSlice.js";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages=[],
    isMessagesLoading,
    selectedUser,
  } = useSelector(state=>state.chat);
  const { currentUser } = useSelector(state=>state.user);
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
    subscribeToNewMessages();
    return () => unsubscribeFromMessages();

  }, [selectedUser._id,dispatch,subscribeToNewMessages,unsubscribeFromMessages]);

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
      {console.log("messages",messages)}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        return (
          message?.senderId && (
            <div
              key={message._id}
              className={`chat ${message.senderId === currentUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === currentUser._id
                        ? currentUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
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
          )
        );
      })}

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;