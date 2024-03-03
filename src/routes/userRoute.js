import express from "express";
import { fileLocalUpload } from "../middleware/multerFile.js";

const router = express.Router();

import { register,login } from "../controller/userController.js";

router.route('/register').post(
    fileLocalUpload.fields([ //profile pic upload
        {
            name: "avatar",
            maxCount: 1,
        }
    ]),
    register
);
router.route('/login').post(login);
// router.route('/logout').post(logout);
// router.route('/profile').post(profile);

export default router;