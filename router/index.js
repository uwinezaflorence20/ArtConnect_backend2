import express from "express"
import { forgotPassword, login, signUp, verifyOtp } from "../controllers/user.controller.js"
const router=express.Router()
router.route("/signUp").post(signUp)
router.route("/verify/otp").post(verifyOtp)
router.route("/forgot/password").post(forgotPassword)
router.route("/login").post(login)
export default router