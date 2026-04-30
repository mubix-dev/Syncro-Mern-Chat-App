import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

import {serverURL} from "../main"
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
function Signup() {
  let navigate = useNavigate();
  const [show,setShow] = useState(false)
  const [loading,setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error,setError] = useState("")

  const dispatch = useDispatch();

  const onHandleSignup = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverURL}/api/auth/signup`,{username,email,password},{withCredentials:true})
      dispatch(setUserData(result.data))
      navigate("/verify-email", { state: { email } });
      setUsername("")
      setEmail("")
      setPassword("")
      setLoading(false)
      setError("")
    } catch (error) {
      console.log(error)
      setUsername("")
      setEmail("")
      setPassword("")
      setLoading(false)
      setError(error?.response?.data.message)
    }
  }
  return (
    <div className="w-full min-h-screen bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-112.5 h-130 bg-white shadow-lg shadow-gray-500 rounded-xl flex flex-col gap-5">
        <div className="w-full h-50 bg-blue-500 rounded-xl rounded-b-[30%] flex justify-center items-center shadow-gray-500">
          <h1 className="text-2xl font-bold text-gray-800">
            Welocome to <span className="text-white">Syncro</span>
          </h1>
        </div>
        <form className="w-full flex flex-col gap-5 items-center justify-center" onSubmit={onHandleSignup}>
          <input
            className="w-[90%] outline-none border-b-2 border-blue-500 px-2.5 py-2.5 rounded-lg shadow shadow-gray-400"
            onChange={(e)=>setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
          />
          <input
            className="w-[90%] outline-none border-b-2 border-blue-500 px-2.5 py-2.5 rounded-lg shadow shadow-gray-400"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
          />
          <div className="w-[90%] relative">
            <input
            className="w-full outline-none border-b-2 border-blue-500 overflow-hidden  px-2.5 py-2.5 rounded-lg shadow shadow-gray-400"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            type={`${show ? "text":"password"}`}
            placeholder="Password"
          />
          <span className="absolute top-2.5 right-2.5 cursor-pointer" onClick={()=>setShow(prev=>!prev)}>{show ? <img className="w-6" src="hide.png" alt="hide icon" />:<img className="w-6 " src="view.png" alt="view icon"/>}</span>
          </div>
          {error?<p className="text-red-500">{error}</p>:null}
          <button className="bg-blue-500 w-50 h-10 font-bold text-white shadow-lg shadow-gray-200 cursor-pointer rounded-lg hover:bg-blue-700" disabled={loading}>
           {loading?"Loading...":"Sign Up"}
          </button>
          <p>
            Already have an account ?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
