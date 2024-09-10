import jwt from "jsonwebtoken";
import { generateResponse } from "../helpers/response.helper.js";

export const checkAuth = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return generateResponse(res, 401, "Unauthorized", null, false);
    } else {
      // console.log(decoded);
      req.userId = decoded.userId;
      next();
    }
  });
};
