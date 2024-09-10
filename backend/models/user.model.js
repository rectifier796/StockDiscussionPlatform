import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        unique:true,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:null
    },
    profilePicture:{
        type:String,
        default: null
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    updatedAt:{
        type:Date,
        default: Date.now()
    }
},{
    timestamps: true
})

export const userModel =  mongoose.model("User", userSchema);