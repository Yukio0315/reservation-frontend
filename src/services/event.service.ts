import axios from "../plugins/axios";
import authHeader from "./auth-header";

class EventService {
  getEvent(id: number) {
    return axios.get(`events/${id}`, { headers: authHeader() });
  }
}

export default new EventService();
