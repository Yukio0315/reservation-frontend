import axios from "axios";
// import { BACKEND_URL } from "../utils/config";

export default axios.create({
  baseURL: "http://localhost:8080/v1",
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
});
