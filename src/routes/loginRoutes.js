import express from "express";

const router = express.Router();

import { login,logout,profile,register } from "../controller/loginController.js";

router.get('/', (req,res)=>{
    console.log("Version Set");
    res.send({
        message:"HomePage",
    });
})

router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/profile').post(profile);
router.route('/register').post(register);

export { router };