import React from 'react';
import { useSelector } from "react-redux";
import dp from "../assets/empty-profile.jpg";

function ReceiverMessage({ image, message, imageScroll }) {
  const { selectedUser } = useSelector((state) => state.user);

  return (
    
    <div className="max-w-[85%] lg:max-w-[70%] self-start flex  gap-2">
      
      
      <div
        className="w-8 h-8 shrink-0 rounded-full border-2 border-white overflow-hidden shadow-md"
      >
        <img
          className="w-full h-full object-cover"
          src={selectedUser?.image || dp}
          alt="User"
        />
      </div>

      
      <div className="flex flex-col gap-2 px-4 py-3 text-slate-800 rounded-2xl rounded-tl-none bg-slate-400 shadow-md">
        {image && (
          <div className="w-full">
            <img 
              className='w-full max-w-60 h-auto rounded-lg object-cover shadow-sm' 
              src={image} 
              alt="Attachment" 
              onLoad={imageScroll}
            />
          </div>
        )}

        {message && (
          <span className="text-sm lg:text-base wrap-break-word font-semibold text-[#06141B]">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

export default ReceiverMessage;