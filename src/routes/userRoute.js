import express from "express";
import { fileLocalUpload } from "../middleware/multerFile.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

import { 
    register,
    login,
    logout,
    refreshToken,
    changeCurrentPassword,
    getUser
} from "../controller/userController.js";

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

//securedRoutes
router.route('/logout').post(verifyJWT,logout);
router.route('/refreshToken').post(refreshToken);
router.route('/changePassword').post(verifyJWT,changeCurrentPassword);
router.route('/getUser').get(verifyJWT,getUser);

export default router;