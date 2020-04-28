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
