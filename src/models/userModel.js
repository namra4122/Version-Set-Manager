import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userid:{
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true, //to make userid searchable in database
    },
    fullName:{
      type: String,
      required: true,
      trim: true,
      index: true, //to make userid searchable in database
    },
    email:{
      type:String,
      required:[true,"E-Mail Required"],
      unique:true,
      lowercase:true,
      trim:true,
    },
    avatar:{
      type:String,
      required:true,
    },
    role:{
      type:String,
      required:true,
      lowercase:true,
      trim:true,
    },
    password:{
      type:String,
      required:[true,"Password Required"]
    },
    refreshToken:{
      type:String,
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = bcrypt.hash(this.password, 10);
  }
  next();
}); //avoid using ()=>{} in pre kyu ki arrow function se context nahi milata parameter ka

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}; //use to compare password when user is login with his/her stored password

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id: this._id,
    userid: this.userid,
    fullName: this.fullName,
    role: this.role
  },process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
} //generate AccessToken

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id: this._id,
  },process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
} //generate RefreshToken

export const User = mongoose.model("userData", userSchema);