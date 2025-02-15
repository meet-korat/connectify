import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { signUpFailure,signUpStart,signUpSuccess } from "../store/userSlice.js";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    password: "",
    email: "",
    
  });
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const isSigningup=useSelector(state=>state.user.IsSigningup);


  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();

    if(success ===true){
        dispatch(signUpStart());
        try {
          const response = await axiosInstance.post("/auth/signup", formData, {
            withCredentials: true,
          });
          
          dispatch(signUpSuccess(response.data));
          navigate("/");
        } catch (error) {
          dispatch(signUpFailure(error.response?.data?.message || "Something went wrong"));
          toast.error(error.response?.data?.message || "Something went wrong");

        }
    }

  };

  return (

    <div className="min-h-screen bg-[#3B6790] text-[#FBFBFB]">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mt-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-blue-200 flex items-center justify-center 
              group-hover:bg-blue-300 transition-colors"
              >
                <MessageSquare className="size-6 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p >Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input rounded-md border w-full pl-10 p-3`}
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input border rounded-md p-3 w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input border p-2 rounded-md w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700  transition-all w-full" >
              {isSigningup ? (
                <>
                  <Loader2 className="size-0" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
           </button>
          </form>

          <div className="text-center mt-[-1rem]">
            <p className="text-base-content/60 ">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
);
};

export default SignupPage;