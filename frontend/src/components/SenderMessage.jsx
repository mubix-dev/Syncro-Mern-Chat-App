import React from 'react';
import { useSelector } from "react-redux";
import dp from "../assets/empty-profile.jpg";

function SenderMessage({ image, message, imageScroll }) {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="max-w-[85%] lg:max-w-[70%] self-end flex flex-row-reverse  gap-2">
      
      <div
        className="w-8 h-8 shrink-0 rounded-full border-2 border-cyan-700 overflow-hidden shadow-md"
      >
        <img
          className="w-full h-full object-cover"
          src={userData?.image || dp}
          alt="User"
        />
      </div>

      {/* 3. Message Bubble */}
      <div className="flex flex-col gap-2 px-4 py-3 text-slate-100 rounded-2xl rounded-tr-none bg-[#11212D] shadow-md">
        {image && (
          <img
            className="w-full max-w-60 h-auto rounded-lg self-end"
            src={image}
            onLoad={imageScroll}
            alt="Attachment"
          />
        )}
        {message && (
          <span className="text-sm lg:text-base wrap-break-word">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

export default SenderMessage;