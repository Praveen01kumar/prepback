/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';


export const MulterConfig = {
  storage: diskStorage({
    destination: './profileImg',
    filename: (req, file, callback) => {
      const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const CloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const uploadToCloudinary = async (filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(`./profileImg/${filename}`, { folder: 'users' }, (error, result) => {
      if (error) { reject(error); } else { resolve(result); }
    });
  });
}

export const updateCloudinaryImage = async (filename: string, publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(`./profileImg/${filename}`,
      { public_id: publicId, folder: 'users', overwrite: true, },
      (error, result) => { if (error) { reject(error); } else { resolve(result); } }
    );
  });
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) { reject(error); } else { resolve(result); }
    });
  });
};


export const extractPublicIdFromCloudinaryUrl = async (url: string) => {
  if (!url) { return null }
  const regex = /\/v\d+\/([^/]+)\/([^/]+)\./;
  const match = url?.match(regex);
  return match ? match[2] : null;
}
