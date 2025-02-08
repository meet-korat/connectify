import { X } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { setSelectedUser } from "../store/chatSlice.js";

const ChatHeader = () => {
  const { selectedUser } = useSelector(state=>state.chat);
  const dispatch=useDispatch();
  const { OnlineUsers=[] } = useSelector(state=>state.user);

  if (!selectedUser) {
    return null;  // Or return a loading state/placeholder
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.image || "/avatar.png"} alt={selectedUser?.fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {OnlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(setSelectedUser(null))}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;