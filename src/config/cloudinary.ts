import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import { envs } from './envs';
  
  const cloudinaryOptions = {
    cloud_name: envs.CLOUDINARY_CLOUD_NAME,
    api_key: envs.CLOUDINARY_API_KEY,
    api_secret: envs.CLOUDINARY_API_SECRET
  }

  interface error {
    StatusCode: number;
    message: string;
  }

  export class Cloudinary {

    constructor() { }


    static uploadImage = async (filePath: string ): Promise<[error?, string?]> => {
        cloudinary.config(cloudinaryOptions);
        try {
            const answer = await cloudinary.uploader.upload(filePath, {
                folder: 'borriquita',
                use_filename: true,
                unique_filename: false
            });

            const res = answer.secure_url;

            if(typeof res !== 'string') {
                return [{
                    StatusCode: 500,
                    message: 'Error uploading image'
                }];
            }
        
            return [, answer.secure_url]; 
        } catch (error) {
            console.error('error:', error);
            return [{
                StatusCode: 500,
                message: 'Error uploading image'
            }];
        }
    }
};