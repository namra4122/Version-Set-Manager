import { Course } from '../models/courseModel.js';
import { User } from '../models/userModel.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';

const addCourse = asyncHandler(async (req, res) => {
    //get course details
    //check whether that course is not already available
    //assign faculty to a course
    //check whether faculty is assigned exists or not?

    const { courseCode, courseName, facultyName } = req.body;

    if(!courseCode || !courseName || !facultyName){
        throw new apiError(400, "Please Provide Course Details");
    }

    if(await Course.findOne({ courseCode })){
        throw new apiError(400, "Course Already Exists");
    }

    const faculty_id = await User.findOne({fullName: facultyName})._id

    const course = await Course.create({
        courseCode,
        courseName,
        faculty_id
    });

    // check whether the data created
    const createdCourse = await Course.aggregate([
        {
            $match:{ _id: course._id }
        }
    ])

    if (!createdCourse) {
        throw new apiError(500, "Something went wrong while creating Course");
    }

    return res.status(201).json(
        new apiResponse(200, createdCourse, "Course Added Successfully")
    )
})

const removeCourse = asyncHandler(async (req, res) => {
    // get course id
    // remove course
    const { courseCode } = req.body;

    if(!courseCode){
        throw new apiError(400,"Provide Course Code");
    }
    
    const course = await Course.aggregate([
        {
            $match:{courseCode}
        }
    ])
    if(course.length===0){
        throw new apiError(400,"Course doesn't Exists");
    }

    await Course.deleteOne({ courseCode} );

    const deletedCourse = await Course.aggregate([
        {
            $match:{courseCode}
        }
    ])

    if (deletedCourse.length!==0) {
        throw new apiError(500, "Something went wrong while deleting Course");
    }

    return res.status(201).json(
        new apiResponse(200,"", "Course Removed Successfully")
    )

})

const getCourse = asyncHandler(async(req,res) => {

    const course = await Course.aggregate([
        {
            $match:{ courseCode: req.query.courseCode }
        }
    ])
    if(course.length===0){
        throw new apiError(400,"Course doesn't Exists");
    }
    return res.status(200).json(
        new apiResponse(
            200,course,"Course fetched Successfully"
        )
    )
})

const getAllCourse = asyncHandler(async (req, res) => {
    // get all course details
    const allCourses = await Course.aggregate([{$match:{}}])
    return res.status(200).json(
        new apiResponse(
            200,allCourses,"All Course fetched Successfully"
        )
    )
})

export {
    addCourse,
    removeCourse,
    getCourse,
    getAllCourse
}

// db.enrollments.aggregate([
//     {
//       $lookup: {
//         from: "user",
//         localField: "student_id",
//         foreignField: "_id",
//         as: "student"
//       }
//     },
//     {
//       $unwind: "$student"
//     },
//     {
//       $match: {
//         "student.role": "student"
//       }
//     },
//     {
//       $group: {
//         _id: "$student_id",
//         studentFullName: {
//           $first: "$student.fullName"
//         },
//         totalCourses: {
//           $sum: 1
//         }
//       }
//     }
//   ])