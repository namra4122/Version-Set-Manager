import { User } from '../models/userModel.js'
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { fileCloudUpload } from '../util/cloudFile.js';
import { apiResponse } from '../util/apiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessRefreshToken = async (userId) =>{

    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //store generated RefreshToken in DB
        user.refreshToken = refreshToken;
        //saved refreshToken in DB without any validation
        await user.save({ validateBeforeSave: false });

        return { accessToken,refreshToken }

    }catch(error){
        throw new apiError(500, "Something went wrong while generating Access and Refresh Token");
    }
}

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

    const { userid, email, fullName, role, password } = req.body;

    //not empty validation
    if ([userid, email, fullName, role, password].some((fields) => fields?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    //vit student validation
    const emailRegExp = /^[a-zA-Z0-9.]+@(?:vitstudent\.ac\.in|vit\.ac\.in)$/;
    if (!emailRegExp.test(email)) {
        throw new apiError(400, "Register from VIT Mail only");
    }

    //role validation
    if (role !== "student" && role !== "faculty" && role !== "admin") {
        throw new apiError(400, "Invalid Role Type");
    }

    //checking whether user is already created or not
    if (await User.findOne({ userid })) {
        throw new apiError(409, "User with this UserID already exists");
    }

    //avatar pic validation
    if (!req.files || !req.files.avatar) {
        throw new apiError(400, "Avatar File Required");
    }

    //upload avatar in cloudinary
    const avatarImg = await fileCloudUpload(req.files?.avatar[0]?.path);
    if (!avatarImg) {
        throw new apiError(400, "Error Uploading the File");
    }

    //create User
    const user = await User.create({
        userid,
        email,
        fullName,
        avatar: avatarImg.url,
        role,
        password
    });

    // check whether the data created
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

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

    const { userid, password } = req.body;

    // console.log(email);

    //check empty fields
    if (!userid) {
        throw new apiError(400, "UserID are required");
    }
    
    //find user in DB
    const user = await User.findOne({ userid })
    if(!user){
        throw new apiError(404, "User don't Exists. Please Register");
    }
    
    //check user credential
    // console.log(userSchema);
    const isPasswordValid = await User.isPasswordCorrect(password,user.password);
    // console.log(isPasswordValid);
    if(!isPasswordValid){
        throw new apiError(401, "Invalid Credentials");
    }

    const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id);

    const option = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
              .cookie("accessToken" , accessToken, option)
              .cookie("refreshToken" , refreshToken, option)
              .json(
                new apiResponse(
                    200,
                    {
                        loggdinUser: user,accessToken,refreshToken
                    },
                    "User Successfully LoggedIn")
               )
})

const logout = asyncHandler(async (req,res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
              .clearCookie("accessToken", option)
              .clearCookie("refreshToken", option)
              .json(new apiResponse(200,"","User Logout"));
})

const refreshToken = asyncHandler(async(req,res) =>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized Access");
    }

    const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    // console.log(decodeToken);

    const user = await User.findById(decodeToken._id);
    // console.log(user);

    if(!user){
        throw new apiError(401, 'Invalid refresh Token');
    }

    // console.log(incomingRefreshToken);
    // console.log(user.refreshToken);
    if(incomingRefreshToken !== user?.refreshToken){
        throw new apiError(401, 'Refresh Token is expired');
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken,newrefreshToken} = generateAccessRefreshToken(user._id);

    return res.status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", newrefreshToken, options)
              .json(
                new apiResponse(
                    200,
                    {accessToken,refreshToken:newrefreshToken},
                    "AccessToken & RefreshToken Updated"
                )
              )
})

const changeCurrentPassword = asyncHandler(async(req, res) => {

    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword,user.password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getUser = asyncHandler(async(req,res) => {

    return res.status(200).json(
        new apiResponse(
            200,req.user,"User fetched Successfully"
        )
    )
})

const getStudent = asyncHandler(async(req,res) => {

    const allStudent = await User.aggregate([
        {
            $match:{
                role: "student"
            }
        },
        {
            "$project": {
                userid: 1,
                fullName: 1
            }
        }
    ])

    // console.log(allStudent);
    return res.status(200).json(
        new apiResponse(
            200,allStudent,"Students fetched Successfully"
        )
    )
})

const getFaculty = asyncHandler(async(req,res) => {

    const allFaculty = await User.aggregate([
        {
            "$match": {
                role: "faculty"
            }
        },
        {
            "$project": {
                userid: 1,
                fullName: 1
            }
        }
    ])

    return res.status(200).json(
        new apiResponse(
            200,allFaculty,"Faculty fetched Successfully"
        )
    )
})

export { 
    register,
    login,
    logout,
    refreshToken,
    changeCurrentPassword,
    getUser,
    getStudent,
    getFaculty
};