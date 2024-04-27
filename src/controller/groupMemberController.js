import { GroupMember } from "../models/groupMemberModel.js";
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

const checkUser = async(user) => {
    if(user.role !== "student"){
        throw new apiError(400,"Unauthorized to Access");
    }
}

const addMember = asyncHandler(async(req,res)=>{
    
    checkUser(req.user);

    const { groupName,studentName } = req.body;

    if( !groupName||!studentName ){
        throw new apiError(400,"Please enter all Member deatils");
    }

    const group_id = await Group.findOne({ groupName: groupName });
    const student_id = await User.findOne({ fullName: studentName, role:"student" });

    if(!group_id||!student_id){
        throw new apiError(400,"Invalid Group or Student Details");
    }

    if(req.user._id !== group_id.groupOwner){
        throw new apiError(400,"Only Group Owner can add Group Member");
    }

    const newMember = await GroupMember.create({
        group_id,
        student_id
    });

    // check whether the data created
    const newMemberDetails = await GroupMember.aggregate([
        {
            $match:{ _id: newMember._id }
        }
    ])

    if (!newMemberDetails) {
        throw new apiError(500, "Something went wrong while creating Group");
    }

    return res.status(201).json(
        new apiResponse(200, newMemberDetails, "Successfully")
    )
});

const removeMember = asyncHandler(async(req,res) => {
    
});

const memberCount = asyncHandler(async(req,res) => {

});

export {
    addMember,
    removeMember,
    memberCount
}