import { v4 as uuidv4 } from 'uuid';
import { BaseUser, Users, User } from './user.types';

const users : Users = {
  1: {
    id: '1',
    login: 'Test_1',
    password: 'zxcvbn1',
    age: 99,
    isDelete: true,
  },
  2: {
    id: '2',
    login: 'Test_2',
    password: 'qwerty2',
    age: 67,
    isDelete: false,
  },
  3: {
    id: '3',
    login: 'Test_3',
    password: 'pass_213',
    age: 12,
    isDelete: false,
  },
};

type FindAll = (withDeleted?: boolean) => Promise<BaseUser[]>;
type Find = (userID: string) => Promise<null | BaseUser>;
type AutoSuggestedList = (loginSubstring: string, limit: number) => Promise<null | BaseUser[]>;
type Create = (newUser: User) => Promise<BaseUser>;
type Update = (userID: string, userUpdate: User) => Promise<BaseUser | null>;
type Remove = (userID: string) => Promise<null | BaseUser>;

export const findAll: FindAll = async (withDeleted = false) => {
  let activeUsers: BaseUser[] = Object.values(users);

  if (!withDeleted) {
    activeUsers = activeUsers.filter(({ isDelete }) => !isDelete);
  }

  return activeUsers;
};

export const find: Find = async (userID) => {
  const user: BaseUser = users[userID];

  if (user.isDelete) {
    return null;
  }

  return user;
};

export const create: Create = async (newUser) => {
  const userID: string = uuidv4();

  users[userID] = {
    ...newUser,
    isDelete: false,
    id: userID,
  };

  return users[userID];
};

export const update: Update = async (userID, userUpdate) => {
  const user = await find(userID);

  if (user === null) {
    return null;
  }

  users[userID] = {
    ...user,
    ...userUpdate,
  };

  return users[userID];
};

export const remove: Remove = async (userID) => {
  const user = await find(userID);

  if (!user) {
    return null;
  }

  users[userID] = {
    ...user,
    isDelete: true,
  };

  return users[userID];
};

export const autoSuggestedList: AutoSuggestedList = async (loginSubstring, limit) => {
  let usersList = await findAll();

  usersList = usersList
    .filter(({ login }) => login.includes(loginSubstring))  // filter user by login substring
    .slice(0, limit) // slice user by limit
    .sort(
      (aUser, bUser) => aUser.login.localeCompare(bUser.login),
    ); // sort users list by login property

  if (!usersList) {
    return null;
  }

  return usersList;
};
