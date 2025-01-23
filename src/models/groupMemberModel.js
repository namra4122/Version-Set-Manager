import mongoose,{ Schema } from "mongoose";

const groupMemberSchema = new Schema(
    {
        group_id:{
            type: Schema.Types.ObjectId,
            ref: "groupData"
        },
        student_id:{
            type: Schema.Types.ObjectId,
            ref: "userData"
        }, //user se hi lena hai but make sure woh role "student" hai
    },
    {
        timestamps: true
    }
)

export const GroupMember = mongoose.model("groupMembers",groupMemberSchema);