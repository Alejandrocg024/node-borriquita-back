import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),

  CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').required().asString(),
  CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').required().asString(),
  CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').required().asString(),

  STRIPE_API_KEY: get('STRIPE_API_KEY').required().asString(),
  FRONTEND_URL:get('FRONTEND_URL').required().asString(),

}