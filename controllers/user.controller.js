import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import customError from "../middlewares/customError.js";
import bcrypt from "bcrypt"
import { otpGenerator } from "../utils/otp.js";
import { sendEmail } from "../utils/sendEmail.js";

//signup
export const signUp = async (req, res, next) => {
    console.log("hy")
    try {
        //check if user is registered before
        const check = await userModel.findOne({Email: req.body.Email })
        if (check) {
            const error = new customError(`the user with email ${req.body.Email}`, 400)
            return next(error)
        }
        
        //compare password and confirm password
        if(req.body.Password !== req.body.ConfirmPassword){
            const error=new customError("password do not match",400)
            return next(error)
        }
        //otp
        const otp=otpGenerator()
//send otp on user email
await sendEmail(req.body.Email,"Your Verification Code",`Your OTP verification code is ${otp}. Please use this code to complete your registration`)
        //bcrypt
        const hashPassword=await bcrypt.hash(req.body.Password,10)
        const newUser =new userModel({
            FirstName:req.body.FirstName,
            LastName:req.body.LastName,
            Email:req.body.Email,
            Password:hashPassword,
            Otp:otp
        })
        //save user to database
        const saveUser=await newUser.save()
        if(!saveUser){
            const error=new customError("failed to save to database",400)
            return next(error)
        }
        res.status(201).json({
message:"user created successfully",
NewUser:saveUser
        })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json("there is an error in creating user account")
    }
}
// verify otp
export const verifyOtp=async(req,res,next)=>{
try{
    
    //check if there is user with the following otp
    const user=await userModel.findOne({Otp:req.body.Otp})
    if(!user){
        const error=new customError(`There is not user with otp ${req.body,Otp}`,400)
        return next(error)
    }
    //check if user has verified his/her otp
    if(user.OtpVerified === true){
res.status(200).json({message:"account already verified"})
    }
    user.OtpVerified=true
    await user.save()
    res.status(200).json({
        message: "OTP verified successfully, account is now active."
      });
}
catch(error){
    console.log(error.message)
    res.status(500).json({message:"something went wrong in verify otp,please try again"})
}
}
//forgot password
export const forgotPassword=async(req,res,next)=>{
    try{
    //check if user already has an account
    const user=await userModel.findOne({Email:req.body.Email})
    if(!user){
        const error=new customError( `No user with email ${req.body.Email} please first create account on ArtConnect`,400)
    return next(error)
    }//check if user verify  otp
    if (user.OtpVerified === false) {
        return next(new customError("verify your account", 401))
    }
    //check if new password is the same as confrim new password
    if(req.body.NewPassword !==req.body.ConfirmNewPassword){
        const error=new customError("Password do not match",400)
        return next(error)
    }
    //hash new password
    const hashPassword=await bcrypt.hash(req.body.NewPassword,10)
user.Password=hashPassword
await user.save()
res.status(200).json({
    message: "Password updated successfully"
  });

}
catch(error){
    console.log(error)
    res.status(500).json({message:"something went wrong, try again"})
}
}
// login
export const login=async(req,res,next)=>{
    try{
//check if user provide email and password
const email = req.body.Email
const password = req.body.Password
if (!email || !password) {
    return next(new customError("invalid email or password", 401))
}
// Check if the user exists
const user = await userModel.findOne({ Email: req.body.Email });
if (!user) {
    return next(new customError("Invalid credentials", 404));
}
//check if user verify  otp
if (user.OtpVerified === false) {
    return next(new customError("verify your account", 401))
}

// Check if the password matches
const isPasswordValid = await bcrypt.compare(req.body.Password, user.Password);
if (!isPasswordValid) {
    return next(new customError("Invalid credentials", 401));
}
//GENERATE TOKEN
const token=jwt.sign({Email:user.Email,FirstName:user.FirstName,LastName:user.LastName},process.env.JWT_SECRET)
res.status(200).json({
    message:"user login successfully",
    token:token
})
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message:"something went wrong,tr again"})
    }
}
