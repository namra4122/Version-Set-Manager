import express from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
    addCourse,
    removeCourse,
    registerCourse,
    unregisterCourse,
    updateCourse,
    getCourse
} from "../controller/courseController.js";

router.use(verifyJWT);
router.route("/getCourses").get(getCourse);

export default router;