import { User } from '../models/userModel.js'
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { fileCloudUpload } from '../util/cloudFile.js';
import { apiResponse } from '../util/apiResponse.js';

const register = asyncHandler(async (req, res) => {
    //get details
    //not empty,proper email format and proper role validation
    //account already?
    //avatar pic validation
    //upload avatar on cloudinary
    //check user created
    //create user
    //remove password and refresh token from respond
    //return res

    const { email, fullName, role, password } = req.body;

    //not empty validation
    if ([email, fullName, role, password].some((fields) => fields?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    //vit student validation
    const emailRegExp = /^[a-zA-Z0-9.]+@(?:vitstudent\.ac\.in|vit\.ac\.in)$/;
    if (!emailRegExp.test(email)) {
        throw new apiError(400, "Register from VIT Mail only");
    }

    //role validation
    if (role !== "student" && role !== "faculty") {
        throw new apiError(400, "Invalid Role Type");
    }

    //checking whether user is already created or not
    const existedUser = await User.findOne({ email });
    // console.log(existedUser);
    if (existedUser) {
        throw new apiError(409, "User with this email already exists");
    }

    //avatar pic validation
    if (!req.files ?? avatar) {
        throw new apiError(400, "Avatar File Required");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    //upload avatar in cloudinary
    const avatarImg = await fileCloudUpload(avatarLocalPath);
    if (!avatarImg) {
        throw new apiError(400, "Error Uploading the File");
    }

    // console.log(avatarImg.url);

    //create User
    const user = await User.create({
        email,
        fullName,
        avatar: avatarImg.url,
        role,
        password
    });

    // check whether the data created
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    console.log(createdUser);

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering User");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully")
    )

})

const login =  asyncHandler(async (req,res) => {
    //get login details
    //check ki empty hai ki nahi
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const { email, password } = req.body;

    if ([email, password].some((fields) => fields?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

})

export { register,login };