import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import { setSelectedUser, setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
function Login() {
  let navigate = useNavigate();
  const [loading,setLoading] = useState(false)
  const [show,setShow] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const dispatch = useDispatch();

  const onHandleLogin = async (e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const result = await axios.post(`${serverURL}/api/auth/login`,{email,password
      },{withCredentials:true})
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      setEmail("")
      setPassword("")
      setLoading(false)
      navigate("/")
      setError("")
    } catch (error) {
      console.log(error)
      setEmail("")
      setPassword("")
      setLoading(false)
      setError(error?.response?.data.message)
    }
  }
  return (
    <div className="w-full min-h-screen bg-[#253745] flex justify-center items-center">
      <div className="w-full max-w-90 lg:max-w-110 h-120 lg:h-130 bg-[#9BA8AB] shadow-lg  rounded-xl flex flex-col gap-5">
        <div className="w-full h-50 bg-[#06141B] rounded-xl rounded-b-[30%] flex justify-center items-center shadow-gray-500">
          <h1 className="text-2xl font-bold text-gray-600">
            Login to <span className="text-[#CCD0CF]">Syncro</span>
          </h1>
        </div>
        <form className="w-full flex flex-col gap-5 items-center justify-center mt-5"onSubmit={onHandleLogin}>
          
          <input
            className="w-[90%] outline-none bg-[#CCD0CF] border-b-2 border-[#06141B] px-2.5 py-2.5 rounded-lg shadow shadow-black"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
          />
          <div className="w-[90%] relative">
            <input
            className="w-full bg-[#CCD0CF] outline-none border-b-2 border-[#06141B] overflow-hidden  px-2.5 py-2.5 rounded-lg shadow shadow-black"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            type={`${show ? "text":"password"}`}
            placeholder="Password"
          />
          <span className="absolute top-2.5 right-2.5 cursor-pointer" onClick={()=>setShow(prev=>!prev)}>{show ? <img className="w-6" src="hide.png" alt="hide icon" />:<img className="w-6" src="view.png" alt="view icon"/>}</span>
          </div>
          {error?<p className="text-red-500">{error}</p>:null}
          <button className="bg-[#253745] w-50 h-10 font-bold text-white shadow-md shadow-black cursor-pointer rounded-lg duration-150 hover:bg-[#06141B] mt-2.5" disabled={loading}>
            {loading?"Loading...":"Login"}
          </button>
          <p>
            Want to create an account ? {" "}
            <span
              className="text-cyan-900 cursor-pointer hover:text-[#06141B]"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
