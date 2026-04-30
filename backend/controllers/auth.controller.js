import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all credentials" });
    }

    const checkUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkUser) {
      return res.status(400).json({
        message: "User with this username or email already exists",
      });
    }

    if(password.length < 8){
        return res.status(400).json({message:"Password is atleast 8 characters!"})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        username,
        email,
        password:hashedPassword
    })

    const token = generateToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:true
    })

    return res.status(201).json({
        username:username,
        email:email
    })

  } catch (error) {
    return res.status(500).json({message:`Signup error, ${error}`})
  }
};

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"Please enter all credentials!"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials!"});
        }

        const isMatchPassword = await bcrypt.compare(password,user.password);

        if(!isMatchPassword){
            return res.status(400).json({message:"Invalid credentials!"})
        }

        const token = generateToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"None",
            secure:true
        })

        console.log("Login successfully")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("Login error occured!",error)
    }
}

const logout = async(req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/" 
        });
        res.clearCookie("token");
        console.log("Logout successfully")
        return res.status(200).json({message:"Logout successfully!"})
    } catch (error) {
        return res.status(500).json({ message: "Logout error occurred!", error: error.message });
    }
}
export { signUp,login,logout };



