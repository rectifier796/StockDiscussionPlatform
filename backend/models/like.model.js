import mongoose from "mongoose";
import { postModel } from "./post.model.js";

const likeSchema = new mongoose.Schema({
    postId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps: true
})

likeSchema.post('save', async function(doc){
    const post = await postModel.findById(doc.postId);
    post.likesCount = post.likesCount + 1;
    await post.save();
})

likeSchema.pre('deleteOne', async function(next, doc){
    console.log(this.getQuery());
    const post = await postModel.findById(this.getQuery().postId);
    post.likesCount = post.likesCount - 1;
    await post.save();
    next();
})

export const likeModel = mongoose.model("Like", likeSchema);