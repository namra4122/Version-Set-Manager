import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        projectTitle:{
            type: String,
            required: [true, "Project Title is Required"],
            lowercase: true,
            index: true
        },
        aboutProject: {
            type: String,
        },
        codebaseUrl:{
            type: String,
        },
        docUrl:{
            type: String,
        },
        pptUrl:{
            type: String,
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "courseData"
        },
        group_id:{
            type: Schema.Types.ObjectId,
            ref: "groupData"
        },
    },
    {
        timestamps: true
    }
)

export const Project = mongoose.model("projectData", projectSchema);