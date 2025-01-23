import express from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";

const router = express.Router();

import {
    courseEnroll,
    dropCourse,
    enrolledCourseCount
} from "../controller/enrollmentController.js";

router.use(verifyJWT);

router.route('/enrollCourse').post(courseEnroll);
router.route('/dropCourse').post(dropCourse);
router.route('/courseCount').get(enrolledCourseCount);

export default router;