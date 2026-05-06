import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { httpError } from "../utils/httpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "..", "..", "uploads");

const folderByField = {
  profileImage: "profiles",
  resume: "resumes",
  image: "projects"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folder = folderByField[file.fieldname] || "misc";
    const destination = path.join(uploadsRoot, folder);
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    callback(null, `${Date.now()}-${safeBase || "upload"}${extension}`);
  }
});

function fileFilter(_req, file, callback) {
  const isImage = file.fieldname === "profileImage" || file.fieldname === "image";
  const isResume = file.fieldname === "resume";

  if (isImage && !file.mimetype.startsWith("image/")) {
    callback(httpError(400, "Only image files are allowed for images"));
    return;
  }

  if (isResume && file.mimetype !== "application/pdf") {
    callback(httpError(400, "Resume must be a PDF"));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export function fileUrl(req, fieldName) {
  const files = req.files || {};
  const file = Array.isArray(files[fieldName]) ? files[fieldName][0] : req.file;

  if (!file) {
    return "";
  }

  const folder = folderByField[fieldName] || "misc";
  return `/uploads/${folder}/${file.filename}`;
}
