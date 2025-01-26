import dotenv from "dotenv";
import connectDB from "./db/mongodbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path:"./.env",
})

const dbConnect = () =>{
    connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server Listening at ${process.env.PORT}`);
        }) //if not PORT than 8000
    })
    .catch((err) => {
        console.error(`MongoDB connection Failed. Retrying in 3 seconds...: ${err}`);
        setTimeout(dbConnect, 3000);
    })
}

dbConnect();