import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setVerifiedStatus,setUserData } from "../redux/userSlice";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverURL}/api/auth/verify-email`, { email, otp });
      if (res.data.success) {
        dispatch(setVerifiedStatus(true));
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error");
      dispatch(setUserData(null));
      setTimeout(() => {
      navigate("/signup");
    }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold">Verify Your Email</h2>
        <p>Enter the code sent to {email}</p>
        <input 
          className="border-b-2 border-blue-500 text-center text-2xl tracking-widest outline-none" 
          maxLength="6" 
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-blue-500 text-white py-2 rounded">Verify</button>
      </form>
    </div>
  );
}

export default VerifyEmail