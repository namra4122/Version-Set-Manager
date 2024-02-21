import mongoose from "mongoose";
import { dbName } from "../constant.js";

const userData = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true
  },
  occ: {
    type: String,
    required: true
  }
}, { timestamps: true });

const dbStruct = mongoose.model(dbName, userData);

export { dbStruct };