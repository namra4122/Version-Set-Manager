import { User, userSchema } from '../models/userModel.js'
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { fileCloudUpload } from '../util/cloudFile.js';
import { apiResponse } from '../util/apiResponse.js';

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
    // console.log(existedUser);
    if (await User.findOne({ email })) {
        throw new apiError(409, "User with this email already exists");
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

    const { email, password } = req.body;

    // console.log(email);

    //check empty fields
    if (!email) {
        throw new apiError(400, "Email are required");
    }
    
    //find user in DB
    const user = await User.findOne({ email })
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
    // console.log(req.user);
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



export { register,login,logout};