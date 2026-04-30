import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"; 

import useCurrentUser from "./hooks/useCurrentUser.js";
import useOtherUserData from "./hooks/useOtherUsersData.js";
import useGetMessages from "./hooks/useGetMessages.js";
import { serverURL } from "./main.jsx";
import { setOnlineUsers, setSocket } from "./redux/userSlice.js";

function App() {
  useCurrentUser();
  useOtherUserData();
  useGetMessages();
  
  const { userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData && userData.isVerified) {
      const socketIo = io(`${serverURL}`, {
        query: { userId: userData._id },
      });

      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketIo.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [userData]); 

  return (
    <Routes>
      <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" />} />
      <Route path="/verify-email" element={userData?.isVerified ? <Navigate to="/profile" /> : <VerifyEmail />} />

      <Route 
        path="/" 
        element={userData?.isVerified ? <Home /> : <Navigate to={userData ? "/verify-email" : "/login"} />} 
      />
      <Route 
        path="/profile" 
        element={userData?.isVerified ? <Profile /> : <Navigate to={userData ? "/verify-email" : "/login"} />} 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;