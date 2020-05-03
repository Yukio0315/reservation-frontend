import axios from "../plugins/axios";
import authHeader from "./auth-header";

class ReservationService {
  add(id: number, start: string, end: string) {
    return axios.post(
      `reservations/${id}`,
      { start, end },
      { headers: authHeader() }
    );
  }
  cancel(id: number, reservationId: number) {
    return axios.post(
      `reservations/${id}`,
      { id: reservationId },
      { headers: authHeader() }
    );
  }
}

export default new ReservationService();
