import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsersData: null,
    selectedUser: null,
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsersData: (state, action) => {
      state.otherUsersData = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setUserData,
  setOtherUsersData,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
} = userSlice.actions;

export default userSlice.reducer;
