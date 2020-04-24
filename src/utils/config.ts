import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/.env`;
    break;
  default:
    path = `${__dirname}/.env.local`;
}
dotenv.config({ path });
console.log(process.env.BACKEND_URL);

export const BACKEND_URL = process.env.BACKEND_URL;
