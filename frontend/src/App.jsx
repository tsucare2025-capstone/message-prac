import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Messages from './pages/Messages'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from "lucide-react";
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, checkAuth, isCheckAuth, onlineUsers } = useAuthStore();

  console.log({onlineUsers});

  useEffect(() => {
    // Check auth status on mount - only run once
    checkAuth();
  }, []); // Empty dependency array to prevent infinite loop

  console.log(authUser);
  // Show loading spinner while checking auth
  if (isCheckAuth) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  return (

    <div data-theme="light">
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : 
          <>
          <Navbar />
          <LoginPage />
          </>
        } />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : 
          <>
            <Navbar />
            <SignupPage />
          </>
        } />
        <Route path="/messages" element={authUser ? <Messages /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App