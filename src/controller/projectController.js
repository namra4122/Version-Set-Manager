import { Project } from '../models/projectModel.js';
import { Group } from '../models/groupModel.js';
import { Course } from '../models/courseModel.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';

const createProject = asyncHandler(async(req,res) => {
    checkUser(req.user);
    const { projectTitle, aboutProject, courseName, groupName } = req.body;

    if (!projectTitle || !aboutProject || !courseName || !groupName) {
        throw new apiError(400, "Please Enter all required Details");
    }

    const course = await Course.findOne({ course_name: courseName });
    const group = await Group.findOne({ group_name: groupName });
    
    if (!course || !group) {
        throw new apiError(400, "Invalid Course or Group Details");
    }

    if (await Project.findOne({ group_id: group._id })) {
        throw new apiError(400, "Each Group can only create one project");
    }

    const project = await Project.create({
        project_title: projectTitle,
        about_project: aboutProject,
        course_id: course._id,
        group_id: group._id
    });

    // check whether the data created
    const createdProject = await Project.findById(project._id);

    if (!createdProject) {
        throw new apiError(500, "Something went wrong while creating Project");
    }

    return res.status(201).json(
        new apiResponse(200, createProject, "Project Created Successfully")
    );
});

const deleteProject = asyncHandler(async(req,res) => {
    const { projectId } = req.params;
    
    if (!projectId){
        throw new apiError(404, "Please Enter all required Details");
    }

    if(!await Project.findById(projectId)){
        throw new apiError(400, "Invalid Project ID");
    }
    
    const project = await Project.findByIdAndDelete(projectId);

    if(!project){
        throw new apiError(500,"Something went wrong while deleting Project");
    }

    return res.status(204).json(
        new apiResponse(200,"Project Successfully Deleted")
    );
});

const getAllProject = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find().populate('course_id').populate('group_id');
        return res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching projects" });
    }
});  

const getProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await Project.findById(projectId).populate('course_id').populate('group_id');
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      return res.status(200).json({ project });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching project" });
    }
});  

export {
    createProject,
    deleteProject,
    getAllProject,
    getProject
}  