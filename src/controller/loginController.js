// import asyncHandler from 'express-async-handler'
import { dbStruct } from '../models/userModel.js';
// const asyncHandler = require("express-async-handler");
// const db_struct = require('../models/personal');

const profile = "Test";
// asyncHandler(async (req,res) => {
//     console.log("Fetching Data: ", req.query);

//     if (req.query.age || req.query.occ) {
//         res.status(400);
//         console.error("Bad Request: 'name' parameter missing");
//         res.json({ error: "'name' parameter missing" });
//         return;
//     }
    
//     const data = await db_struct.find(req.query).sort({ name: 1 });

//     if (data.length === 0) {
//         res.status(404);
//         console.error("Contact Not Found");
//         res.json({ error: "Contact Not Found" });
//         return;
//     }
    
//     res.status(200).json(data);
// });

const register = "Test1";
// asyncHandler(async (req, res) => {
//     const { name, age, occ } = req.query;
//     if (!name || !age || !occ) {
//       res.status(400);
//       console.error("All fields are mandatory !");
//       res.json({ error: "All fields are mandatory !" });
//       return;
//     }
//     const existingData = await db_struct.findOne({ name });
//     if (existingData) {
//         res.status(409);
//         console.error("Data with the same name already exists");
//         res.json({ error: "Data with the same name already exists" });
//         return;
//     }
//     const data = await db_struct.create({name,age,occ});
//     console.log("Data Created");
//     res.status(201).json({ message: "Data Created" });
// });

const login = "Test2";
// asyncHandler(async (req, res) => {
//     const { name, age, occ } = req.query;

//     const existingData = await db_struct.findOne({ name });
    
//     if (existingData) {
//         const data = await db_struct.updateOne({ name },{ $set: { age,occ } });
//         console.log(data);
        
//         if(data.nModified > 0){
//             res.status(200).json({ message: "Data Updated" }); //Data Update not printing?
//             return;
//         }else{
//             res.status(200).json({ message: "No Modification Done" });
//             return;
//         }
//     }
    
//     res.status(404);
//     console.error("Contact Not Found");
//     res.json({ error: "Contact Not Found" });
// });

const logout = "Test3";
// asyncHandler(async (req,res) => {
//     console.log("Deleting Data: ",req.query);

//     if (!req.query.name) {
//         res.status(400);
//         console.error("Bad Request: 'name' parameter missing");
//         res.json({ error: "'name' parameter missing" });
//         return;
//     }

//     const data = await db_struct.find({ name: req.query.name });

//     if (data.length == 0) {
//         res.status(404);
//         console.error("Contact Not Found");
//         res.json({ error: "Contact Not Found" });
//         return;
//     }
//     await db_struct.deleteMany({ name: req.query.name });
//     res.status(200).json(data);
// });

export {login, logout, profile, register,}