import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/temp');
    },

    filename: function (req,file,cb) {
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1E5);
        cb(null,file.originalname+'-'+uniqueSuffix);
    }
})
  
export const fileLocalUpload = multer({ 
    storage: multerStorage
})