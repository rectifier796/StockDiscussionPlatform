import mongoose from "mongoose";
import { generateResponse } from "../helpers/response.helper.js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return generateResponse(
        res,
        400,
        "Necessary Credentials Missing",
        null,
        false
      );
    }

    const checkUser = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (checkUser) {
      return generateResponse(
        res,
        400,
        "Username and Email should be unique",
        null,
        false
      );
    }

    const newUser = await userModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10)
    });

    // console.log(newUser);

    return generateResponse(
      res,
      201,
      "User registered successfully",
      {
        userId: newUser._id,
      },
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return generateResponse(
        res,
        400,
        "Neccessary Credentials Missing",
        null,
        false
      );
    }

    const checkUser = await userModel.findOne({ email });

    if (!checkUser) {
      return generateResponse(res, 400, "Email not registered", null, false);
    }

    const match = await bcrypt.compare(password, checkUser.password);

    if (!match) {
      return generateResponse(res, 400, "Invalid Credentials", null, false);
    }

    const token = jwt.sign(
      { userId: checkUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10d" }
    );

    return generateResponse(
      res,
      200,
      "User registered successfully",
      {
        token,
        user: {
          id: checkUser._id,
          username: checkUser.username,
          email: checkUser.email,
        },
      },
      true
    );
  } catch (err) {
    console.log(err);
    return generateResponse(res, 500, "Internal Server Error", null, false);
  }
};
