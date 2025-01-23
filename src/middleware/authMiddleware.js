import { User } from "../models/userModel.js";
import { apiError } from "../util/apiError.js";
import { asyncHandler } from "../util/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            console.log("inside if token:",token);
            throw new apiError(401, "Unauthorized Token");
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeToken._id).select("-password -refreshToken");
        if(!user){
            throw new apiError(401,"Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token");
    }
})