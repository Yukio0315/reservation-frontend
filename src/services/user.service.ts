import axios from "../plugins/axios";
import authHeader from "./auth-header";

class UserService {
  getUserProfile(id: number) {
    return axios.get(`users/${id}`, { headers: authHeader() });
  }
}

export default new UserService();
