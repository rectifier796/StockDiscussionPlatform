import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/profile');
    },
    filename: function(req,file,cb){
        const suffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null, file.originalname+"-"+suffix);
    }
})

export const upload = multer({storage : storage});