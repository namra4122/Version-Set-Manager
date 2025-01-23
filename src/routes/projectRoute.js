import express from 'express';
import { fileLocalUpload } from "../middleware/multerFile.js";
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

import {
    createProject,
    deleteProject,
    getAllProject,
    getProject
} from '../controller/projectController.js'

router.use(verifyJWT);
router.route('/createProject').post(createProject);
router.route('/deleteProject').post(deleteProject);
router.route('/codeUpload').post(
    fileLocalUpload.fields([
        {
            name: "code",
            maxCount: 1,
        }
    ]),
    codeUpload
);
router.route('/docUpload').post(
    fileLocalUpload.fields([
        {
            name: "document",
            maxCount: 3,
        }
    ]),
    docUpload
);
router.route('/pptUpload').post(
    fileLocalUpload.fields([
        {
            name: "ppt",
            maxCount: 3,
        }
    ]),
    pptUpload
);

router.route('/getAllProject').get(getAllProject);
router.route('/getProject').get(getProject);

export default router;