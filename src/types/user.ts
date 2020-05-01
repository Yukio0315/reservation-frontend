export type NewUser = {
  email: string;
  userName: string;
  password: string;
};

export type SignInUser = {
  email: string;
  password: string;
};

export type AccessToken = {
  code: number;
  expire: string;
  token: string;
  id: number;
  permission: string;
};

export type UserProfile = {
  createdAt: string;
  userName: string;
  email: string;
  permission: string;
  reservations: Array<Reservation>;
};

type Reservation = {
  id: number;
  start: string;
  end: string;
};
