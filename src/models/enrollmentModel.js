import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
    {
        student_id:{
            type: Schema.Types.ObjectId,
            ref: "userData"
        }, //user se hi lena hai but make sure woh role "student" hai
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "courseData"
        },
    },
    {
        timestamps: true
    }
)

export const Enrollment = mongoose.model("courseEnrollment", enrollmentSchema);