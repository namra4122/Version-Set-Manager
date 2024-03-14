import { Course } from '../models/courseModel.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';
import jwt from 'jsonwebtoken';

const addCourse = asyncHandler(async(req,res)=>{
    //get course details
    //check whether that course is not already available
    //assign faculty to a course
    //check whether faculty is assigned exists or not?

    const { courseCode, courseName } = req.body;

    //TODO: aggregate
})
const removeCourse = asyncHandler(async(req,res)=>{
    // get course id
    // remove course
})
const updateCourse = asyncHandler(async(req,res)=>{
    // get updated fields
    // update values in database
    // save database
})
const getCourse = asyncHandler(async(req,res) => {
    // get all course details
})

export { 
    addCourse,
    removeCourse,
    registerCourse,
    unregisterCourse,
    updateCourse,
    getCourse
}