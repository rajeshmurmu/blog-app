import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .optional(),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters long")
    .optional(),
  slug: z.string().min(5, "Slug must be at least 5 characters long").optional(),
  image: z
    .union([z.instanceof(File), z.object()])
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        if (typeof val === "object" || typeof val === "string") return true;
        // val is File here
        return (
          val.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(val.type)
        );
      },
      {
        message:
          "Invalid image or unsupported format (max 5MB, jpg/jpeg/png/webp)",
      }
    ),
});
