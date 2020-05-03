import axios from "../plugins/axios";
import authHeader from "./auth-header";

class EventService {
  getAllEvents(id: number) {
    return axios.get(`events/${id}`, { headers: authHeader() });
  }
  delete(id: number, start: string, end: string) {
    return axios.delete(`admins/${id}/events`, {
      headers: authHeader(),
      data: { start, end }
    });
  }
}

export default new EventService();
