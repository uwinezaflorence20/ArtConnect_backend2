import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.js";
import customError from "./middlewares/customError.js";
import router from "./router/index.js";
import swagger from "./docs/swagger.js" assert{type:"json"};
// import swagger from "./docs/swagger.json" assert { type: "json" };
import swaggerUi from "swagger-ui-express"
dotenv.config();
const app=express();
app.use(express.json());
app.use(router)
app.use(cors())
app.use("/API/ArtConnect",swaggerUi.serve, swaggerUi.setup(swagger))
app.all('*',(req,res,next)=>{
    const err=new customError(`Can't find ${req.originalUrl} on this Server`,404)
    next(err)
})
const database_string=process.env.DATABASE;
const port=process.env.PORT;
//connect to database
mongoose.connect(database_string)
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
        console.log("database connected successfully")
    })
})
.catch((error)=>{
    console.log("database not connected")
    console.log(error.message)
})
app.use(errorHandler)