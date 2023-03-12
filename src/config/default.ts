import * as dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const VALID_USERNAME = process.env.VALID_USERNAME || '';
export const VALID_PASSWORD = process.env.VALID_PASSWORD || '';

export const MONGO_PATH = process.env.MONGO_PATH || '';

export const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
