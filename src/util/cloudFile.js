import { v2 as cloudinary } from 'cloudinary'; //Cloud Upload SDK (Can be AWS,AZURE,etc.)
import fs from 'fs' //File System
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileCloudUpload = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        const fileResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })

        console.log("File Uploaded!!" ,fileResponse.url);
        return fileResponse;
    }catch(error){
        console.error(error);
        fs.unlink(localFilePath);
        return null;
    }
}

export { fileCloudUpload };