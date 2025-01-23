import express from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
    createGroup,
    deleteGroup,
    getGroup,
    getAllGroup
} from "../controller/groupController.js"

router.use(verifyJWT);
router.route("/createGroup").post(createGroup);
router.route("/deleteGroup").post(deleteGroup);
router.route("/getGroup").get(getGroup);
router.route("/getAllGroup").get(getAllGroup);

export default router;