import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { fileUrl } from "../middleware/upload.js";

function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function getOwnPortfolio(userId) {
  let portfolio = await Portfolio.findOne({ user: userId });

  if (!portfolio) {
    portfolio = await Portfolio.create({ user: userId });
  }

  return portfolio;
}

export const getMyPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  res.json(portfolio);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const profileImage = fileUrl(req, "profileImage");
  const resume = fileUrl(req, "resume");

  portfolio.profile = {
    ...portfolio.profile.toObject(),
    fullName: req.body.fullName ?? portfolio.profile.fullName,
    title: req.body.title ?? portfolio.profile.title,
    bio: req.body.bio ?? portfolio.profile.bio,
    profileImage: profileImage || portfolio.profile.profileImage,
    resume: resume || portfolio.profile.resume
  };

  await portfolio.save();
  res.json(portfolio);
});

export const updateContact = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);

  portfolio.contact = {
    email: req.body.email ?? portfolio.contact.email,
    phone: req.body.phone ?? portfolio.contact.phone,
    linkedin: req.body.linkedin ?? portfolio.contact.linkedin,
    github: req.body.github ?? portfolio.contact.github
  };

  await portfolio.save();
  res.json(portfolio);
});

export const createProject = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const title = String(req.body.title || "").trim();

  if (!title) {
    throw httpError(400, "Project title is required");
  }

  portfolio.projects.push({
    title,
    description: req.body.description || "",
    techStack: splitList(req.body.techStack),
    image: fileUrl(req, "image"),
    liveLink: req.body.liveLink || "",
    githubLink: req.body.githubLink || ""
  });

  await portfolio.save();
  res.status(201).json(portfolio);
});

export const updateProject = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const project = portfolio.projects.id(req.params.projectId);

  if (!project) {
    throw httpError(404, "Project not found");
  }

  const uploadedImage = fileUrl(req, "image");
  project.set({
    title: req.body.title ?? project.title,
    description: req.body.description ?? project.description,
    techStack: req.body.techStack !== undefined ? splitList(req.body.techStack) : project.techStack,
    image: uploadedImage || project.image,
    liveLink: req.body.liveLink ?? project.liveLink,
    githubLink: req.body.githubLink ?? project.githubLink
  });

  await portfolio.save();
  res.json(portfolio);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const project = portfolio.projects.id(req.params.projectId);

  if (!project) {
    throw httpError(404, "Project not found");
  }

  project.deleteOne();
  await portfolio.save();
  res.json(portfolio);
});

export const createSkill = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const name = String(req.body.name || "").trim();

  if (!name) {
    throw httpError(400, "Skill name is required");
  }

  portfolio.skills.push({
    name,
    level: req.body.level || ""
  });

  await portfolio.save();
  res.status(201).json(portfolio);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const skill = portfolio.skills.id(req.params.skillId);

  if (!skill) {
    throw httpError(404, "Skill not found");
  }

  skill.set({
    name: req.body.name ?? skill.name,
    level: req.body.level ?? skill.level
  });

  await portfolio.save();
  res.json(portfolio);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const skill = portfolio.skills.id(req.params.skillId);

  if (!skill) {
    throw httpError(404, "Skill not found");
  }

  skill.deleteOne();
  await portfolio.save();
  res.json(portfolio);
});

export const createExperience = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const organization = String(req.body.organization || "").trim();
  const role = String(req.body.role || "").trim();

  if (!organization || !role) {
    throw httpError(400, "Organization and role are required");
  }

  portfolio.experiences.push({
    organization,
    role,
    duration: req.body.duration || "",
    description: req.body.description || ""
  });

  await portfolio.save();
  res.status(201).json(portfolio);
});

export const updateExperience = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const experience = portfolio.experiences.id(req.params.experienceId);

  if (!experience) {
    throw httpError(404, "Experience not found");
  }

  experience.set({
    organization: req.body.organization ?? experience.organization,
    role: req.body.role ?? experience.role,
    duration: req.body.duration ?? experience.duration,
    description: req.body.description ?? experience.description
  });

  await portfolio.save();
  res.json(portfolio);
});

export const deleteExperience = asyncHandler(async (req, res) => {
  const portfolio = await getOwnPortfolio(req.user._id);
  const experience = portfolio.experiences.id(req.params.experienceId);

  if (!experience) {
    throw httpError(404, "Experience not found");
  }

  experience.deleteOne();
  await portfolio.save();
  res.json(portfolio);
});

export const getPublicPortfolio = asyncHandler(async (req, res) => {
  const username = String(req.params.username || "").toLowerCase().trim();
  const user = await User.findOne({ username }).select("username email");

  if (!user) {
    throw httpError(404, "Portfolio not found");
  }

  const portfolio = await Portfolio.findOne({ user: user._id });

  if (!portfolio) {
    throw httpError(404, "Portfolio not found");
  }

  res.json({ user, portfolio });
});
