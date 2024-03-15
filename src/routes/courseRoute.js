import express from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

import {
    addCourse,
    removeCourse,
    getCourse,
    getAllCourse
} from "../controller/courseController.js";

router.use(verifyJWT);
router.route("/getAllCourse").get(getAllCourse);
router.route("/getCourse").get(getCourse);
router.route("/addCourse").post(adminAuth,addCourse);
router.route("/removeCourse").post(adminAuth,removeCourse);

export default router;