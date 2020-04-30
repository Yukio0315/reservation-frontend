import { AxiosResponse } from "axios";
import axios from "../plugins/axios";
import { NewUser, SignInUser, AccessToken } from "../types/user";

class AuthService {
  async signIn(user: SignInUser): Promise<AccessToken> {
    const response = await axios.post("sign-in", {
      email: user.email,
      password: user.password
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  signOut() {
    localStorage.removeItem("user");
  }

  async register(user: NewUser): Promise<AxiosResponse> {
    return await axios.post("users", {
      userName: user.userName,
      password: user.password,
      email: user.email
    });
  }

  async checkValidURL(query: string): Promise<AxiosResponse> {
    return await axios.get(`reset-password/${query}`);
  }

  async resetPassword(query: string, password: string): Promise<AxiosResponse> {
    return await axios.patch(`reset-password/${query}`, { password });
  }
}

export default new AuthService();
