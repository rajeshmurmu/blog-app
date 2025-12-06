import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImageToCloudinary = async ({ filePath, product_id }) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `blog-app/images/${product_id}`, // organize images by product ID
      use_filename: true,
      unique_filename: false,
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("upload_Image_To_Cloudinary::Error ", error);
  }
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = publicIdWithExtension; // includes folder structure

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.log("deleteImageFromCloudinary::Error ", error);
  }
};

export const deleteAllImageWithFolder = async ({ product_id }) => {
  try {
    // 1. for deleting all images with the prefix (all images of a product) to empty the folder
    await cloudinary.api.delete_resources_by_prefix(
      `blog-app/images/${product_id}/`
    );

    // 2. then delete the folder itself
    // for deleting the folder if needed (deletes all images in the folder)
    await cloudinary.api.delete_folder(`blog-app/images/${product_id}`);
  } catch (error) {
    console.log("delete_ImageFolder_From_Cloudinary:Error ", error);
  }
};
