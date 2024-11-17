import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        require:true
    },
    LastName: {
        type: String,
        require:true
    },
    Email: {
        type:String ,
        require:true
    },
    Password: {
        type:String,
       require:true
        
    },
  ConfirmPassword:{
type:String,
require:true
  },
    Otp: {
        type: Number
    },
    OtpVerified: {
        type: Boolean,
        default: false
    }
})
const userModel = mongoose.model("USERS", userSchema)
export default userModel