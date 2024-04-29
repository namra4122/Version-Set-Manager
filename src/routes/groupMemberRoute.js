import express from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = express.Router();

import {
    addMember,
    removeMember,
    memberCount
} from "../controller/groupMemberController.js"

router.use(verifyJWT);
router.route('/addmember').post(addMember);
router.route('/addmember').post(removeMember);
router.route('/memberCount').get(memberCount);

export default router;