import { Sequelize } from 'sequelize';
import { pgConfig } from './db.config';

export const sequelize = new Sequelize(pgConfig.url);
