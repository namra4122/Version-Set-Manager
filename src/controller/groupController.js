import mongoose from 'mongoose';
import { Group } from '../models/groupModel.js';
import { GroupMember } from '../models/groupMemberModel.js';
import { User } from '../models/userModel.js';
import { Course } from '../models/courseModel.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';

const checkUser = async(user) => {
    if(user.role !== "student"){
        throw new apiError(400,"Unauthorized to Access");
    }
}

const createGroup = asyncHandler(async (req,res) => {
    //verify user is student 
    //get course and faculty details
    //verify whether those details are correct or not
    //create student group
    checkUser(req.user);

    const { groupName, courseCode, facultyName } = req.body;

    if(!groupName||!courseCode||!facultyName){
        throw new apiError(400,"Please Enter all required Details")
    }

    const course_id = await Course.findOne({ courseCode: courseCode });
    const faculty_id = await User.findOne({ fullName: facultyName, role:"faculty" });

    if(!course_id||!faculty_id){
        throw new apiError(400,"Invalid Course or Faculty Details");
    }
    
    //creating group using monogoose session -> helps in transaction handling, what if creating the group succeeded but adding the group member did or vice verse.
    try {
        // Create the group document within a transaction
        // Transactions let you execute multiple operations in isolation and potentially undo all the operations if one of them fails
        const session = await mongoose.startSession();
        session.startTransaction();

        const group = await Group.create(
            {
                groupName,
                groupOwner: req.user._id,
                course_id,
                faculty_id
            },
            { session }
        );

        await GroupMember.create(
            {
                group_id: group._id,
                user_id: req.user._id,
            },
            { session },
        )

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(
            new apiResponse(200,group,"Successfully")
        );
    } catch (error) {
        // Handle potential errors during transaction
        console.error(error);
        await session.abortTransaction(); // Rollback if necessary
        throw new apiError(500, "Error creating group",error);
    }
    
});
const deleteGroup = asyncHandler(async(req,res) => {
    //verify user is student
    //get group details
    //verify whether that group dont have any members
    //delet group
}); 

const getAllGroup = asyncHandler(async(req,res) => {

});

const getGroup = asyncHandler(async(req,res) => {

});

export {
    createGroup,
    deleteGroup,
    getGroup
}