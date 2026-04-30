import React, { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import dp from "../assets/empty-profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaRegImage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverURL } from "../main";
import { setMessages } from "../redux/messageSlice";
import { useEffect } from "react";
function MessageArea() {
  let { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user,
  );
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [emojiPicker, setShowEmojiPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let image = useRef();
  let { messages } = useSelector((state) => state.message);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        dispatch(setMessages([...messages, msg]));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, selectedUser, dispatch]);

  const onClickEmoji = (emoji) => {
    setInput((prevInput) => prevInput + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length === 0 && backendImage == null) {
      return null;
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const imageHandleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-screen bg-slate-200 flex-col relative`}
    >
      {selectedUser ? (
        <>
          <div className="w-full h-20 bg-blue-500 rounded-b-2xl flex items-center gap-5 shadow-md z-10 px-5">
            <FaArrowLeft
              className="w-5 h-5 text-white cursor-pointer"
              onClick={() => {
                dispatch(setSelectedUser(null));
                navigate("/");
              }}
            />
            <div className="relative w-12 h-12">
              {/* Profile Image Wrapper */}
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  className="w-full h-full object-cover"
                  src={selectedUser?.image || dp}
                  alt="Profile"
                />
              </div>

              {/* Online Status Dot - Now correctly positioned relative to the container */}
              {onlineUsers.includes(selectedUser?._id) && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
              )}
            </div>

            <h1 className="text-white font-semibold text-xl">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages &&
              messages.map((msg) =>
                msg.sender === userData._id ? (
                  <SenderMessage
                    image={msg.image}
                    imageScroll={imageHandleScroll}
                    message={msg.message}
                  />
                ) : (
                  <ReceiverMessage
                    image={msg.image}
                    imageScroll={imageHandleScroll}
                    message={msg.message}
                  />
                ),
              )}
            <div ref={scrollRef} />
            {emojiPicker && (
              <div className="absolute bottom-20 left-5 z-50">
                <EmojiPicker
                  width={300}
                  height={400}
                  onEmojiClick={onClickEmoji}
                />
              </div>
            )}
          </div>

          <div className="w-full p-4 absolute bottom-0 bg-slate-200 flex justify-center">
            {frontendImage && (
              <img
                className="w-20 absolute bottom-22 right-15 lg:right-20 rounded-xl shadow-md shadow-gray-500"
                src={frontendImage}
                alt="Preview"
              />
            )}
            <form
              className="w-full lg:max-w-[90%] h-14 bg-blue-500 rounded-full flex items-center gap-4 px-5 shadow-lg"
              onSubmit={handleSendMessage}
            >
              <input type="file" hidden ref={image} onChange={handleImage} />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!emojiPicker)}
              >
                <RiEmojiStickerLine className="text-2xl text-slate-100" />
              </button>
              <input
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-200 outline-none text-lg"
                placeholder="Type a message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
              />
              <FaRegImage
                className="text-2xl text-slate-100 cursor-pointer"
                onClick={() => image.current.click()}
              />
              {(input.length > 0 || backendImage) && (
                <button type="submit">
                  <IoSend className="text-2xl text-slate-100" />
                </button>
              )}
            </form>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
          <h1 className="text-5xl font-bold">
            Welcome to <span className="text-blue-600">Syncro</span>
          </h1>
          <h2 className="text-lg font-semibold text-gray-600">
            Stay in sync with every word.
          </h2>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
