import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    stockSymbol : {
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    likesCount:{
        type: Number,
        default:0
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
},{
    timestamps: true
})

export const postModel = mongoose.model("Post", postSchema);