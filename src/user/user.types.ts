
export type User = {
  login: string,
  password: string,
  age: number,
};

export type BaseUser = User & {
  id: string,
  isDelete: boolean,
};

export type Users = {
  [key: string]: BaseUser,
};
