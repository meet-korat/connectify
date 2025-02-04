import { useState } from "react";
import { updateProfileFailure,updateProfileStart,updateProfileSuccess } from "../store/userSlice";
import { Camera, Mail, User } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast  from "react-hot-toast";
const ProfilePage = () => {
  const [selectedimg,setSelectedimg]=useState(null);
  const dispatch=useDispatch();
  const {IsUpdatingProfile}=useSelector(state=>state.user);
  let currentUser=useSelector(state=>state.user.currentUser);

  const updateProfile =async(data)=>{
      try {
        dispatch(updateProfileStart());

        if (!data) {
          toast.error("Image is required");
          return;
        }

        const response =await axiosInstance.put("/auth/update-profile",{
          image:data
        });

        const updatedUser = {
          _id: response.data._id,
          fullname: response.data.fullname,
          email: response.data.email,
          image: response.data.image
        };

        dispatch(updateProfileSuccess(updatedUser));
        // toast.success("Profile picture updated successfully");

      } catch (error) {
        console.error('Error updating profile:', error);
        dispatch(updateProfileFailure());
        if (error.response) {
          // Server responded with an error
          toast.error(error.response.data.message || "Failed to update profile");
        } else if (error.request) {
          // Request was made but no response
          toast.error("No response from server");
        } else {
          // Error setting up request
          toast.error("Error updating profile");
        }
      }
      
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedimg(base64Image);
      await updateProfile(base64Image);
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };
  };


  return (
    <div className=" pt-20 bg-[#3B6790] text-black ">
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-gray-100 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedimg || currentUser?.image || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-gray-800 hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${IsUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-5 h-5 text-[#FBFBFB] " />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={IsUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">
            {IsUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-gray-100 rounded-lg border ">
              {currentUser?.fullname}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-gray-100 rounded-lg border">
              {currentUser?.email}
            </p>
          </div>
        </div>
      
        <div className="mt-6 bg-gray-100 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span>Member Since</span>
              <span>{currentUser?.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
export default ProfilePage;