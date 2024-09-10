import mongoose from "mongoose";
import { generateResponse } from "../helpers/response.helper.js";
import { userModel } from "../models/user.model.js";
import fs from "fs";
import path from "path";

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return generateResponse(res, 400, "UserId Required", null, false);
    }

    if (!mongoose.isValidObjectId(userId)) {
      return generateResponse(res, 400, "Invalid UserId", null, false);
    }

    const userData = await userModel
      .findById(userId)
      .select("username bio profilePicture");

    if(!userData){
        return generateResponse(
            res,
            400,
            "No data found",
            null,
            false
          );
    }

    const imagePath = path.join(`public/profile/${userData.profilePicture}`);

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log(err);
        return generateResponse(res, 500, "Internal Server Error", null, false);
      }

      const base64Image = Buffer.from(data).toString("base64");

      return generateResponse(
        res,
        200,
        null,
        {
          _id: userData._id,
          username: userData.username,
          bio: userData.bio,
          profilePicture: base64Image,
        },
        true
      );
    });
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const filename = req?.file?.filename;
    const { username, bio } = req.body;

    if (username) {
      const checkUsername = await userModel.findOne({ username });
      if (checkUsername) {
        return generateResponse(res, 400, "Username In Use", null, false);
      }
    }

    await userModel.findByIdAndUpdate(userId, {
      username,
      bio,
      profilePicture: filename,
    });

    return generateResponse(res, 201, "Profile Updated", null, true);
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};
