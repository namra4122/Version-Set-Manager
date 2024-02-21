import dotenv from "dotenv";
import connectDB from "./db/mongodbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path:"./.env",
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server Listening at ${process.env.PORT}`);
        }) //if not PORT than 8000
    })
    .catch((err) => {
        console.error(`MongoDB connection Failed: ${err}`);
    })