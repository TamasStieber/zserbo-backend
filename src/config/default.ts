import * as dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const VALID_USERNAME = process.env.VALID_USERNAME || "";
export const VALID_PASSWORD = process.env.VALID_PASSWORD || "";

export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PW = process.env.MONGO_PW || "";
export const MONGO_URI = process.env.MONGO_URI || "";

export const MONGO_PATH =
  `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_URI}` || "";

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "";
