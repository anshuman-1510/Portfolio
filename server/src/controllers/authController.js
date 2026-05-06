import bcrypt from "bcryptjs";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { signToken } from "../utils/token.js";

function normalizeUsername(username = "") {
  return username.toLowerCase().trim();
}

function validateUsername(username) {
  return /^[a-z0-9_-]{3,32}$/.test(username);
}

export const signup = asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");

  if (!validateUsername(username)) {
    throw httpError(400, "Username must be 3-32 characters using letters, numbers, hyphens, or underscores");
  }

  if (!email || !password) {
    throw httpError(400, "Email and password are required");
  }

  if (password.length < 8) {
    throw httpError(400, "Password must be at least 8 characters");
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw httpError(409, "Email or username is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashedPassword });
  const portfolio = await Portfolio.create({
    user: user._id,
    profile: { fullName: username },
    contact: { email }
  });

  res.status(201).json({
    token: signToken(user),
    user,
    portfolio
  });
});

export const login = asyncHandler(async (req, res) => {
  const identifier = String(req.body.identifier || req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");

  if (!identifier || !password) {
    throw httpError(400, "Email/username and password are required");
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw httpError(401, "Invalid credentials");
  }

  const portfolio = await Portfolio.findOne({ user: user._id });

  res.json({
    token: signToken(user),
    user,
    portfolio
  });
});

export const me = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  res.json({ user: req.user, portfolio });
});
