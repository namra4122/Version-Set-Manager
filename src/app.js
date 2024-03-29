import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//cross platform reference
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

//api handling limit
app.use(express.json({
    limit: `16kb`
}));
//multr for file uploading

//url-encoder %20 wagera encode karne ke liye
app.use(express.urlencoded({
    extended:true,limit:`16kb`
}));

//storing all static and public items like favicon
app.use(express.static("public")); //reason for public name is i have a folder name public.

app.use(cookieParser());

import userRoute from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js"
//Route declaration
app.use('/api/user',userRoute);
app.use('/api/course',courseRoute);

export { app }