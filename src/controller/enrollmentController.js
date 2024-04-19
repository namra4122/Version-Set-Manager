import { Enrollment } from '../models/enrollmentModel.js';
import { Course } from '../models/courseModel.js';
import { User } from '../models/userModel.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';

const checkUser = async(user) => {
    if(user.role !== "student"){
        throw new apiError(400,"Unauthorized to Access");
    }
}

const courseEnroll = asyncHandler(async(req,res) => {
    //get enrollment details
    //check whether that user is other than student 
    //check if user already enrolled the course
    //add enrollment details to mongoDB
    
    checkUser(req.user);
    const { courseCode } = req.body;

    if ([courseCode].some((fields) => fields?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const course_id = await Course.findOne({ courseCode: courseCode });
    const student_id = req.user._id;
    const alreadyEnroll = await Enrollment.aggregate([
        {
            $match:{ 
                course_id: course_id._id, 
                student_id: student_id,
            }
        }
    ])
    console.log(alreadyEnroll.length !== 0);
    if(alreadyEnroll.length !== 0){
        console.log(alreadyEnroll);
        throw new apiError(400,"Course Already enrolled");
    }

    const enrolledCourse = await Enrollment.create({
        student_id,
        course_id
    });

    // check whether the data created
    const checkEnroll = await Enrollment.aggregate([
        {
            $match:{ _id: enrolledCourse._id }
        }
    ])

    if (!checkEnroll) {
        throw new apiError(500, "Something went wrong while enrolling Course");
    }

    return res.status(201).json(
        new apiResponse(200, checkEnroll, "Course Enrolled Successfully")
    )
})

const dropCourse = asyncHandler(async(req,res) => {
    //get course_id and delete
    checkUser(req.user);
    const { courseCode } = req.query;
    // console.log(courseCode);
    const course_id = await Course.findOne({ courseCode: courseCode });
    const student_id = req.user._id;
    console.log("Student_id: ",student_id);

    const alreadyEnroll = await Enrollment.findOne({ course_id: course_id._id, student_id: student_id });

    if(!alreadyEnroll){
        throw new apiError(400,"You have not enrolled the course");
    }
    
    const deletionResult = await Enrollment.deleteOne({ _id: alreadyEnroll._id });
    
    if (deletionResult.deletedCount !== 1) {
        throw new apiError(500, "Failed to drop the course");
    }

    return res.status(200).json(
        new apiResponse(200,"","Course Dropped Successfully")
    );
})

const enrolledCourseCount = asyncHandler(async(req,res)=>{
    checkUser(req.user);
    const student_id = req.user._id;
    const enrollmentCount = await Enrollment.aggregate([
        {
          $match: {
            student_id: student_id,
          }
        },
        {
          $group: {
            _id: student_id,
            count: { $sum: 1 }
          }
        }
      ]);
    
    // const totalEnrollments = enrollmentCount.length > 0 ? enrollmentCount[0].count : 0;

    return res.status(200).json(
        new apiResponse(200,enrollmentCount[0],"Course Count")
    );
})

export {
    courseEnroll,
    dropCourse,
    enrolledCourseCount
};