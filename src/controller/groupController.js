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

    if(await Group.findOne({ groupName: groupName })){
        throw new apiError(400, "Group with this Name already exists");
    }

    const course_id = await Course.findOne({ courseCode: courseCode });
    const faculty_id = await User.findOne({ fullName: facultyName, role:"faculty" });

    if(!course_id||!faculty_id){
        throw new apiError(400,"Invalid Course or Faculty Details");
    }

    if(await Group.findOne({ groupOwner: req.user._id })){
        throw new apiError(400, "You can't create another Group");
    }
    
    //creating group using monogoose session -> helps in transaction handling, what if creating the group succeeded but adding the group member did or vice verse.
    try {
        // Create the group document within a transaction
        // Transactions let you execute multiple operations in isolation and potentially undo all the operations if one of them fails
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const group = await Group.create(
            [{
                groupName,
                groupOwner: req.user._id,
                course_id: course_id._id,
                faculty_id: faculty_id._id
            }],
            { session }
        );

        await GroupMember.create(
            [{
                group_id: group[0]._id,
                student_id: req.user._id,
            }],
            { session },
        )

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(
            new apiResponse(200,group,"Successfully")
        );
    } catch (error) {
        console.error(error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw new apiError(500, "Error creating group",error);
    }
    
});

const deleteGroup = asyncHandler(async(req,res) => {
    //verify user is student
    //get group details
    //verify whether that group dont have any members
    //delet group
    try {
        checkUser(req.user);
        const { group_id } = req.body;

        if (!group_id) {
            throw new apiError(400, "Please provide the group ID.");
        }
        const group = await Group.findById(group_id).populate('groupOwner');
        if (!group) {
            throw new apiError(400, "Invalid group ID.");
        }
        
        if (group.groupOwner._id.toString() !== req.user._id.toString()) {
            throw new apiError(403, "You are not authorized to delete this group.");
        }
        
        const memberCount = await GroupMember.countDocuments({ group_id: group_id });
        if (memberCount > 1) {
            throw new apiError(400, "Cannot delete group with members. Please remove members first.");
        }
        
        await Group.deleteOne({ _id: group_id });
        await GroupMember.deleteOne( { group_id: group_id});
        
        return res.status(200).json(
            new apiResponse(200, "", "Group deleted successfully")
        );
    }catch (error) {
        throw new apiError(500,error);
    }
}); 

const getAllGroup = asyncHandler(async(req,res) => {
    try {
        checkUser(req.user);
    
        const filters = {}; // Create an empty filter object
        const { groupName } = req.query; // Example query params
        
        if (groupName) {
            filters.groupName = { $regex: new RegExp(groupName, 'i') }; // Case-insensitive search for group name
        }
    
        const groups = await Group.find(filters).populate('groupOwner'); // Fetch groups and populate owner details
    
        return res.status(200).json(new apiResponse(200,groups,""));
    }catch (error){
        throw new apiError(500, "Something went srong while fetch all groups",error); // Assuming a function to handle API errors
    }
});

const getGroup = asyncHandler(async(req,res) => {
    try {
        console.log("INSIDE TRY BLOCK");
        console.log("----------------");
        checkUser(req.user);
        
        const { groupName,includeMembers} = req.query; // Get group name from request params (or query depending on your API design)
        console.log(groupName)
        console.log("----------------");
        
        if (!groupName) {
            throw new apiError(400, "Please provide the group name.");
        }
        
        // fetch Group Details with Owner Information
        const group = await Group.findOne({ groupName: groupName }).populate('groupOwner');
        console.log(group)
        console.log("----------------");
        
        if (!group) {
            throw new apiError(400, "Invalid group name. Group does not exist.");
        }
        
        // retrieve Member Count
        const memberCount = await GroupMember.countDocuments({ group_id: group._id });
        console.log(memberCount)
        console.log("----------------");
        
        // fetch Member Details (Consider Pagination if many members)
        let memberDetails = null;
        if (includeMembers === 'true') { // Optional query param for member details
            memberDetails = await GroupMember.find({ group_id: group._id }).populate('student_id'); // Fetch member details with student information
            console.log(memberDetails)
            console.log("----------------");
        }
        
        return res.status(200).json(
          new apiResponse(200, "", {
            ...group._doc, // Spread group properties
            memberCount,
            memberDetails, // Include member details if requested
          })
        );
    } catch (error) {
        throw new apiError(500,"Something went wrong while fetching group data",error);
    }
});

export {
    createGroup,
    deleteGroup,
    getAllGroup,
    getGroup
}