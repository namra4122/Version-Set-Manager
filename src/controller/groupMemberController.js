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
    checkUser(req.user);

    const { groupMember_id } = req.body;
    
    if( !groupMember_id ){
        throw new apiError(400,"Please enter Member_ID");
    }

    const member = await Group.findOne({ _id: groupMember_id });

    if(!member){
        throw new apiError(400,"Invalid Member details Details");
    }

    if(req.user._id.toString() !== member.groupOwner._id.toString()){
        throw new apiError(403, "You are not authorized to remove this member.");
    }

    await GroupMember.deleteOne({ member });

    const delMember = await GroupMember.aggregate([
        {
            $match:{_id: groupMember_id}
        }
    ])

    if (!delMember) {
        throw new apiError(500, "Something went wrong while Removing Member");
    }

    return res.status(201).json(
        new apiResponse(200,"", "Member Removed Successfully")
    ) 
});

const memberCount = asyncHandler(async(req,res) => {
    try{
        checkUser(req.user);
        const { group_id } = req.body;
    
        if (!group_id) {
          throw new apiError(400, "Please provide the group ID.");
        }
    
        const memberCount = await GroupMember.countDocuments({ group_id: group_id });
    
        return res.status(200).json(new apiResponse(200,memberCount,""));
    }catch(error){
        throw new apiError(500,"Something went wrong while fetching member count",error);
    }
});

export {
    addMember,
    removeMember,
    memberCount
}