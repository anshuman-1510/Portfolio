import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    throw httpError(401, "Authentication token is required");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw httpError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw httpError(401, "Invalid or expired token");
  }
});
