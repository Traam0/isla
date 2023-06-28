import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_NAME)
	throw Error("Add CLOUDINARY_NAME to environment variables");
if (!process.env.CLOUDINARY_API_KEY)
	throw Error("Add CLOUDINARY_API_KEY to environment variables");
if (!process.env.CLOUDINARY_API_SECRET)
	throw Error("Add CLOUDINARY_API_SECRET to environment variables");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };