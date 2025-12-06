const _conf = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp",
  jwtSecret: process.env.JWT_SECRET || "secret",
  clientUrl: process.env.CLIENT_URL,
};

const config = Object.freeze(_conf);

export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const PER_PAGE_LIMIT = 10;
export const STATIC_DIR = "public";
export const UPLOAD_IMAGE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB

export default config;
