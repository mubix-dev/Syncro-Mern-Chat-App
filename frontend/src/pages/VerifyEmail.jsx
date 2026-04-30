import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const email = location.state?.email;

  
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverURL}/api/auth/verify-email`, 
        { email, otp },
        { withCredentials: true } 
      );

      if (res.status === 200) {
        dispatch(setUserData(res.data));
        navigate("/profile");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Verification failed";
      setError(errorMessage);
      
      if (errorMessage.toLowerCase().includes("expired")) {
         setTimeout(() => navigate("/signup"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#253745]">
      <form onSubmit={handleVerify} className="bg-[#9BA8AB] p-8 rounded-xl shadow-lg flex flex-col gap-4 w-96">
        <h2 className="text-xl font-bold text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter the 6-digit code sent to <br/> 
          <span className="font-semibold text-slate-800">{email}</span>
        </p>
        
        <input 
          className="border-b-2 border-slate-800 text-center text-2xl tracking-[0.5em] outline-none py-2 focus:border-[#253745] transition-colors" 
          maxLength="6" 
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={loading}
        />

        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        
        <button 
          type="submit"
          disabled={loading || otp.length < 6}
          className={`py-2 rounded text-white font-medium transition-all ${
            loading || otp.length < 6 ? "bg-slate-500 cursor-not-allowed" : "bg-[#253745] hover:bg-[#06141B]"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;