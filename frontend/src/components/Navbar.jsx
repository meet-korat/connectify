import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { LogOut,MessageSquare,Settings,User } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { logout } from '../store/userSlice'

export const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.IsAuthenticated);
  const Logout= async()=>{
    try {
        console.log(1);
        const res=await axiosInstance.post("/auth/logout");
        console.log(2);
        dispatch(logout());
        console.log(3);
        toast.success("Logged out successfully");  

    } catch (error) {
        toast.error("Something went wrong in logout");
    }
  }

  return (
 <header
      className=" border-b border-gray-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-white/60"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Connectify</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`px-3 py-2 text-sm rounded-lg gap-2 transition-colors`}>
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline ">Settings</span>
            </Link>

            {isAuthenticated &&  (
              <>
                <Link to={"/profile"} className={`px-3 py-2 text-sm rounded-lg gap-2`}>
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={Logout}>
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
