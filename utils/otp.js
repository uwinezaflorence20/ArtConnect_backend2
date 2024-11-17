export const otpGenerator=()=>{
    let otp=0
    otp=Math.ceil(Math.random()*100000)
    return otp
}