import mongoose, { Schema } from "mongoose";

const courseScheme = new Schema(
    {
        courseCode:{
            type: String,
            required:[true,"Course Code Required"],
            unique:true,
            lowercase:true,
            trim:true,
            index: true,
        },
        courseName:{
            type: String,
            required:true,
            index: true,
        },
        faculty_id:{
            type: Schema.Types.ObjectId,
            ref: "userData"
        } //user se hi lena hai but make sure woh role "faculty" hai
    },
    {
        timestamps: true
    }
)


export const Course = mongoose.model("courseData", courseScheme);