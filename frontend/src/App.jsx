import { Navbar } from "./components/Navbar.jsx"
import { Routes,Route,Navigate } from "react-router-dom"
import { HomePage } from "./pages/HomePage.jsx"
import { LoginPage } from "./pages/LoginPage.jsx"
import { SettingsPage } from "./pages/SettingsPage.jsx"
import { ProfilePage } from "./pages/ProfilePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import { useSelector } from "react-redux"
import { Toaster } from "react-hot-toast"

function App() {
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);

  return (
    <>
     
      <Navbar/> 
      <Routes>
        <Route path="/" element={true ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!isLoggedIn ? <LoginPage/> : <Navigate to="/"/> }/>
        <Route path="/signup" element={!isLoggedIn ? <SignupPage/> : <Navigate to ="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={isLoggedIn ? <ProfilePage/> : <Navigate to="/login"/>}/>

      </Routes>
      <Toaster/>
    </>
  )
}

export default App
