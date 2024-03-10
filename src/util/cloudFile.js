import { v2 as cloudinary } from 'cloudinary'; //Cloud Upload SDK (Can be AWS,AZURE,etc.)
import fs from 'fs' //File System
          
cloudinary.config({ 
    cloud_name: 'versionset',
    api_key: '345138626487337',
    api_secret: 'bXqudKX-ja2j08JlDCOlaUyN3mw',
});

const fileCloudUpload = async (localFilePath) => {
    // console.log(localFilePath);
    try{
        if(!localFilePath) return null
        const fileResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })

        fs.unlinkSync(localFilePath);
        return fileResponse;
    }catch(error){
        console.error(error);
        fs.unlink(localFilePath);
        return null;
    }
}

export { fileCloudUpload };