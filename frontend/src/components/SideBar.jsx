import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/empty-profile.jpg";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { serverURL } from "../main";
import {
  setOtherUsersData,
  setUserData,
  setSelectedUser,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const { userData, otherUsersData, selectedUser, onlineUsers } = useSelector(
    (state) => state.user,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (otherUsersData) {
      const filtered = otherUsersData.filter((user) =>
        (user.name || user.username)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, otherUsersData]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsersData(null));
      dispatch(setSelectedUser(null));
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <div
      className={`lg:w-[30%] w-full lg:flex ${!selectedUser ? "flex" : "hidden"} h-screen bg-[#253745] flex flex-col border-r-2 border-slate-600`}
    >
      {/* Header Profile Section */}
      <div className="w-full h-64 shrink-0 bg-[#06141B] rounded-b-[40px] flex flex-col items-center justify-center shadow-lg z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-800 overflow-hidden shadow-xl">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={userData?.image || dp}
              alt="Profile"
              onClick={() => navigate("/profile")}
            />
          </div>
          <h1 className="text-xl font-bold text-white">
            Hello,{" "}
            <span className="text-blue-100">
              {userData?.name || userData?.username}
            </span>
          </h1>
        </div>

        {/* Search Bar Toggle */}
        <div className="w-full flex flex-col items-center mt-4 px-5 gap-3">
          {!isSearching ? (
            <div className="flex items-center gap-3">
              <button
                className="p-3 rounded-full bg-gray-200 shadow-md hover:scale-110 transition-transform"
                onClick={() => setIsSearching(true)}
              >
                <IoSearch className="text-[#06141B]  text-xl" />
              </button>

              {/* Top Avatars - Only visible when NOT searching */}
              <div className="flex gap-2.5  overflow-y-auto">
                {otherUsersData?.map(
                  (user) =>
                    onlineUsers.includes(user._id) && (
                      <div key={user._id} className="relative cursor-pointer" onClick={() => dispatch(setSelectedUser(user))}>
                        <div className="w-10 h-10 rounded-full border-2 border-cyan-700 overflow-hidden shadow-md">
                          <img
                            className="w-full h-full object-cover"
                            src={user.image || dp}
                            alt={user.name}
                          />
                        </div>

                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        
                      </div>
                    ),
                )}
              </div>
            </div>
          ) : (
            <div className="w-full bg-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-inner">
              <IoSearch className="text-[#06141B] text-xl" />
              <input
                autoFocus
                className="w-full outline-none bg-transparent text-gray-700"
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <RxCross2
                className="cursor-pointer text-gray-400 hover:text-red-500"
                onClick={() => {
                  setIsSearching(false);
                  setSearchTerm("");
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* User List Container - NO SCROLLBAR */}
      <div
        className="flex-1 overflow-y-auto w-full py-5 flex flex-col items-center gap-3 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`w-[92%] p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-200 shadow-sm shrink-0
                ${selectedUser?._id === user._id ? "bg-[#11212D] text-white" : "bg-[#9BA8AB] hover:bg-blue-50 text-[#06141B]"}
              `}
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div key={user._id} className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-700 overflow-hidden shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    src={user.image || dp}
                    alt={user.name}
                  />
                </div>

                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h1 className="font-semibold truncate">
                  {user.name || user.username}
                </h1>
                <p
                  className={`text-xs truncate ${selectedUser?._id === user._id ? "text-blue-100" : "text-gray-700"}`}
                >
                  Click to chat
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-200 mt-10">No users found</p>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-red-500 flex justify-center items-center shadow-lg hover:bg-red-600 transition-colors z-20"
        onClick={handleLogout}
      >
        <RiLogoutCircleLine className="text-white text-xl" />
      </button>
    </div>
  );
}

export default SideBar;
