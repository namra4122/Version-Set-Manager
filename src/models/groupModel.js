import mongoose,{ Schema } from "mongoose";

const groupSchema = new Schema(
    {
        groupName:{
            type: String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
            index: true,
        },
        groupOwner:{
            type: Schema.Types.ObjectId,
            ref: "userData"
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "courseData"
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

export const Group = mongoose.model("groupData",groupSchema);