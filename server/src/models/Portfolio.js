import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    image: { type: String, default: "" },
    liveLink: { type: String, trim: true },
    githubLink: { type: String, trim: true }
  },
  { timestamps: true }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert", ""],
      default: ""
    }
  },
  { timestamps: true }
);

const experienceSchema = new mongoose.Schema(
  {
    organization: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    profile: {
      fullName: { type: String, trim: true, default: "" },
      title: { type: String, trim: true, default: "" },
      bio: { type: String, trim: true, default: "" },
      profileImage: { type: String, default: "" },
      resume: { type: String, default: "" }
    },
    projects: [projectSchema],
    skills: [skillSchema],
    experiences: [experienceSchema],
    contact: {
      email: { type: String, trim: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      github: { type: String, trim: true, default: "" }
    }
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
