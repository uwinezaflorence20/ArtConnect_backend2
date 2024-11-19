import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import CustomError from "./middlewares/customError.js";
import router from "./router/index.js";
// import swagger from "./docs/swagger.json" assert { type: "json" };
// import swaggerUi from "swagger-ui-express";
// import swaggerUi from "swagger-ui-express";
// Use require to import JSON
// const swagger = require("./docs/swagger.json");

import swaggerUi from "swagger-ui-express";

const loadSwagger = async () => {
    const swagger = await import("./docs/swagger.json", {
        assert: { type: "json" },
    });
    return swagger.default;
};

// Setup Swagger UI
loadSwagger().then((swagger) => {
    app.use("/API/ArtConnect", swaggerUi.serve, swaggerUi.setup(swagger));
});


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
// app.use("/API/ArtConnect", swaggerUi.serve, swaggerUi.setup(swagger));

app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});

const database_string = process.env.DATABASE;
const port = process.env.PORT;

mongoose
    .connect(database_string)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log("Database connected successfully");
        });
    })
    .catch((error) => {
        console.log("Database not connected");
        console.log(error.message);
    });

app.use(errorHandler);
