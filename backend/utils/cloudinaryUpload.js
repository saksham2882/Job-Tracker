import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadResume = async (file, uploadPreset) => {
    if (!file) {
        throw new Error('No file provided');
    }
    if (file.mimetype !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
    }
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'resumes',
        resource_type: 'raw',
        public_id: `${Date.now()}-${file.name}`,
        upload_preset: uploadPreset,
        access_mode: 'public',
    });
    if (!result.secure_url) {
        throw new Error('Failed to upload resume to Cloudinary');
    }
    return result.secure_url;
};