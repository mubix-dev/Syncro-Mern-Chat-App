import React, { useRef, useState } from "react";
import dp from "../assets/empty-profile.jpg";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import axios from 'axios';
import { setUserData } from "../redux/userSlice";

function Profile() {
  let { userData } = useSelector((state) => state.user);
  let navigate = useNavigate();

  let [name, setName] = useState(userData?.name || "");
  let [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  let [backendImage, setBackendImage] = useState(null);

  let dispatch = useDispatch();
  let [saving, setSaving] = useState(false);
  let imageRef = useRef();

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.put(`${serverURL}/api/user/profile`, formData, { withCredentials: true });
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    // Updated background to match your specified hex exactly
    <div className="w-full min-h-screen bg-[#253745] flex flex-col justify-center items-center gap-5 font-sans">
      
      {/* Back Button - Using a lighter teal for the icon */}
      <div className="fixed top-5 left-5">
        <FaArrowLeft
          className="w-6 h-6 text-[#9eb2c0] hover:text-white cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Profile Image Section */}
      <div 
        // Border and BG updated to blend with #253745
        className="w-48 h-48 rounded-full bg-[#1c2a35] shadow-2xl relative cursor-pointer border-4 border-[#34495e] hover:border-cyan-700 transition-colors mt-5"
        onClick={() => imageRef.current.click()}
      >
        <div className="w-full h-full rounded-full overflow-hidden flex justify-center items-center">
          <img 
            className="w-full h-full object-cover" 
            src={frontendImage} 
            alt="Profile" 
          />
        </div>
        {/* Camera Icon - Background updated to Cyan for better contrast on Teal-Navy */}
        <div className="absolute bottom-2 right-2 bg-cyan-800 p-2.5 rounded-full shadow-lg border-2 border-[#253745]">
          <MdOutlinePhotoCamera className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Form Section */}
      <form 
        className="w-[95%] max-w-md flex flex-col gap-6 items-center justify-center" 
        onSubmit={handleProfile}
      >
        <input 
          type="file" 
          accept="image/*" 
          hidden 
          ref={imageRef} 
          onChange={handleImage} 
        />

        {/* Name Input */}
        <div className="w-full flex flex-col gap-2">
           <label className="text-slate-300 text-sm ml-2 font-medium">Display Name</label>
           <input
            // Using a slightly lighter variant of your BG for the input field
            className="w-full outline-none border-b-2 border-cyan-800 bg-[#1c2a35]/60 text-white px-4 py-3 rounded-t-lg shadow-xl placeholder-slate-500 focus:bg-[#1c2a35] transition-all"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter your name"
          />
        </div>

        {/* Read-only Username */}
        <div className="w-full flex flex-col gap-2 opacity-80">
          <label className="text-slate-400 text-sm ml-2">Username</label>
          <input
            // Darker "read-only" style that blends into the navy
            className="w-full outline-none border-b-2 border-[#34495e] bg-[#161f27]/50 text-[#7f8c8d] px-4 py-3 rounded-t-lg cursor-not-allowed"
            type="text"
            readOnly
            value={userData?.username}
          />
        </div>

        {/* Read-only Email */}
        <div className="w-full flex flex-col gap-2 opacity-80">
          <label className="text-slate-400 text-sm ml-2">Email Address</label>
          <input
            className="w-full outline-none border-b-2 border-[#34495e] bg-[#161f27]/50 text-[#7f8c8d] px-4 py-3 rounded-t-lg cursor-not-allowed"
            type="email"
            readOnly
            value={userData?.email}
          />
        </div>

        {/* Submit Button */}
        <button 
          className={`w-full max-w-[200px] h-12 font-bold shadow-xl cursor-pointer rounded-xl transition-all mt-4 mb-4
            ${saving 
              ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
              : "bg-cyan-800 text-white hover:bg-cyan-700 active:scale-95 shadow-cyan-900/20"
            }`} 
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               Saving...
            </span>
          ) : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;