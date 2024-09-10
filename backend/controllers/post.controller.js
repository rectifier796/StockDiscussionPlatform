import mongoose from "mongoose";
import { generateResponse } from "../helpers/response.helper.js";
import { postModel } from "../models/post.model.js";
import { commentModel } from "../models/comment.model.js";
import { likeModel } from "../models/like.model.js";

export const createPost = async (req, res) => {
  try {
    const { stockSymbol, title, description, tags } = req.body;

    const userId = req.userId;

    if (!stockSymbol || !title || !description) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (tags && !Array.isArray(tags)) {
      return generateResponse(res, 400, "Tags should be array", null, false);
    }

    const newPost = await postModel.create({
      userId,
      stockSymbol,
      title,
      description,
      tags,
    });

    return generateResponse(
      res,
      201,
      "Post Created",
      { postId: newPost._id },
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const getSingleStock = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return generateResponse(res, 400, "PostId Required", null, false);
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const stockDetails = await postModel
      .findById(postId)
      .select("-__v -tags -updatedAt");

    const comments = await commentModel
      .find({ postId })
      .select("userId comment createdAt");

    return generateResponse(
      res,
      200,
      null,
      {
        postId,
        stockSymbol: stockDetails.stockSymbol,
        title: stockDetails.title,
        description: stockDetails.description,
        createdAt: stockDetails.createdAt,
        likesCount: stockDetails.likesCount,
        comments,
      },
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const getAllPost = async (req, res) => {
  try {
    let { page = 1, limit = 10, stockSymbol, tags, sortBy = "likes", order = "desc" } = req.query;

    if(page<1)
        page=1;

    const config = {};
    if(stockSymbol){
        config["stockSymbol"] = stockSymbol;
    }
    if(tags){
        tags = JSON.parse(tags);
        if(!Array.isArray(tags)){
            return generateResponse(res, 400, "Tags should be array", null, false);
        }
        config['tags'] = { $all : tags}
    }
    if(sortBy !== "likes" && sortBy !== "date"){
        return generateResponse(res, 400, "Sort by likes or date only", null, false);
    }
    if(order !== "asc" && order !== "desc"){
        return generateResponse(res, 400, "Allowed Order - asc or desc", null, false);
    }

    sortBy = sortBy === "likes" ? "likesCount" : "createdAt";
    order = order === "desc" ? -1 : 1;

    // console.log(sortBy, order);
    const sortConfig = {};
    sortConfig[sortBy] = order;

    const postDetails = await postModel
      .find(config)
      .select("stockSymbol title description likesCount createdAt")
      .skip(limit*(page - 1))
      .limit(limit)
      .sort(sortConfig);
      

    return generateResponse(
      res,
      200,
      null,
      {count : postDetails.length, postDetails},
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    if (!postId) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const deletedPost = await postModel.deleteOne({
      _id: postId,
      userId,
    });

    if (deletedPost.deletedCount === 0) {
      return generateResponse(res, 400, "Nothing To Delete", null, false);
    }

    return generateResponse(res, 201, "Post deleted successfully", null, true);
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    const userId = req.userId;

    if (!comment || !postId) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const checkPost = await postModel.findById(postId);

    if (!checkPost) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const newComment = await commentModel.create({
      postId,
      userId,
      comment,
    });

    return generateResponse(
      res,
      201,
      "Comment added successfully",
      { commentId: newComment._id },
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const userId = req.userId;

    if (!commentId || !postId) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    if (!mongoose.isValidObjectId(commentId)) {
      return generateResponse(res, 400, "Invalid CommentId", null, false);
    }

    const deletedComment = await commentModel.deleteOne({
      _id: commentId,
      postId,
      userId,
    });

    if (deletedComment.deletedCount === 0) {
      return generateResponse(res, 400, "Nothing To Delete", null, false);
    }

    return generateResponse(
      res,
      201,
      "Comment deleted successfully",
      null,
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    if (!postId) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const checkPost = await postModel.findById(postId);

    if (!checkPost) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const checkLiked = await likeModel.findOne({ userId, postId });

    if (checkLiked) {
      return generateResponse(res, 400, "You have already liked", null, false);
    }

    const newLike = await likeModel.create({ postId, userId });

    return generateResponse(res, 201, "Post Liked", null, true);
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    if (!postId) {
      return generateResponse(
        res,
        400,
        "Provide Necessary Fields",
        null,
        false
      );
    }

    if (!mongoose.isValidObjectId(postId)) {
      return generateResponse(res, 400, "Invalid PostId", null, false);
    }

    const deletedLike = await likeModel.deleteOne({
      postId,
      userId,
    });

    if (deletedLike.deletedCount === 0) {
      return generateResponse(res, 400, "Nothing To Delete", null, false);
    }

    return generateResponse(res, 201, "Post Unliked", null, true);
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};
