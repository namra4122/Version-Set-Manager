import express from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = express.Router();

import {
    addMember,
    removeMember
} from "../controller/groupMemberController.js"

router.use(verifyJWT);
router.route('/addmember').post(addMember);
router.route('/removerMember').post(removeMember);

export default router;