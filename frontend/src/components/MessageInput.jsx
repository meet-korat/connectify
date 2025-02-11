import { useRef, useState } from "react";
import {sendMessageSuccess,sendMessageFailure,sendMessageStart } from "../store/chatSlice.js";
import { useDispatch ,useSelector} from "react-redux";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";


const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const selectedUser = useSelector(state => state.chat.selectedUser);
  const currentUser = useSelector(state => state.user.currentUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (!selectedUser?._id) {
      toast.error("Please select a user to send message");
      return;
    }
    try {
      dispatch(sendMessageStart());

      const formData = new FormData();
      if (text) formData.append("text", text);
      if (imagePreview) formData.append("image", imagePreview);
      formData.append("recieverId", selectedUser._id);
      const response = await axiosInstance.post(`/messages/sender/${selectedUser._id}`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("msg response",response);

      // Create message object with all required fields
      const newMessage = {
        _id: response.data._id,
        text: text,
        image: response.data.image,
        senderId: response.data.senderId,
        recieverId: response.data.recieverId,
        createdAt: new Date().toISOString(),
      };

      dispatch(sendMessageSuccess(newMessage));
      

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(sendMessageFailure());
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;