import { Navbar } from "./components/Navbar.jsx"
import { Routes,Route,Navigate } from "react-router-dom"
import { HomePage } from "./pages/HomePage.jsx"
import { LoginPage } from "./pages/LoginPage.jsx"
import { SettingsPage } from "./pages/SettingsPage.jsx"
import { ProfilePage } from "./pages/ProfilePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import { useSelector,useDispatch } from "react-redux"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { checkAuthStart,checkAuthSuccess,checkAuthFailure } from "./store/userSlice.js"
import { axiosInstance } from "./lib/axios.js"
import { Loader } from "lucide-react"

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.IsAuthenticated);
  console.log(isAuthenticated);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(checkAuthStart());
        await axiosInstance.get("/auth/check", {
          withCredentials: true
        });
        dispatch(checkAuthSuccess());
      } catch (error) {
        dispatch(checkAuthFailure());
      }
    };
    checkAuth();
  }, [dispatch])
  const isLoading = useSelector((state) => state.user.IsLoading);
  console.log(isLoading);
  if(isLoading){
    <div className="flex bg-[#3B6790] items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
    </div>
  }
  return (
    <>
     
      <Navbar/> 
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to="/"/> }/>
        <Route path="/signup" element={!isAuthenticated ? <SignupPage/> : <Navigate to ="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={isAuthenticated ? <ProfilePage/> : <Navigate to="/login"/>}/>

      </Routes>
      <Toaster/>
    </>
  )
}

export default App
