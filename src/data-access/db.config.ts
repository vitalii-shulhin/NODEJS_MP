import dotenv from 'dotenv';
dotenv.config();

type pgConfig = {
  url: string;
};

export const pgConfig: pgConfig = {
  url: process.env.PG_CONNECT_URL || 'test_url',
};
