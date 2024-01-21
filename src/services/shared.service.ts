/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';


export const MulterConfigForProfile = {
  storage: diskStorage({
    destination: './profileImg',
    filename: (req, file, callback) => {
      const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only JPG, JPEG, and PNG files are allowed.'));
    }
    // const fileSize = req.headers['content-length'];
    // if (fileSize && parseInt(fileSize, 10) > 2 * 1024 * 1024) {
    //   return callback(new Error('File size exceeds the allowed limit (2MB).'));
    // }
    callback(null, true);
  },
};

export const MulterConfigForPost = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only JPG, JPEG, and PNG files are allowed.'));
    }
    callback(null, true);
  },
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

export const uploadPostToCloudinary = async (filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(`./uploads/${filename}`, { folder: 'posts' }, (error, result) => {
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
