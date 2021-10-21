export type User = {
  login: string,
  password: string,
  age: number,
};

export type BaseUser = User & {
  id: string,
  isdeleted: boolean,
};

export type Users = {
  [key: string]: BaseUser,
};
