import axios from "../plugins/axios";
import authHeader from "./auth-header";

class UserService {
  getUserProfile(id: number) {
    return axios.get(`users/${id}`, { headers: authHeader() });
  }
  changePassword(id: number, oldPassword: string, newPassword: string) {
    return axios.patch(
      `users/${id}/password`,
      { oldPassword, newPassword },
      { headers: authHeader() }
    );
  }
  changeUserName(id: number, userName: string) {
    return axios.patch(
      `users/${id}/username`,
      { userName },
      { headers: authHeader() }
    );
  }
  changeEmail(id: number, email: string) {
    return axios.patch(
      `users/${id}/email`,
      { email },
      { headers: authHeader() }
    );
  }
  deleteAccount(id: number, email: string) {
    return axios.delete(`users/${id}`, {
      headers: authHeader(),
      data: { email }
    });
  }
}

export default new UserService();
