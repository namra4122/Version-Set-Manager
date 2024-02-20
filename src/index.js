import dotenv from "dotenv";
import connectDB from "./db/mongodbConnect.js";

dotenv.config({
    path:"./.env",
})

connectDB();