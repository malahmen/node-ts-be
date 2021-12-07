import { Dialect } from 'sequelize';

export interface sequelizeConnectionConfig {
  user: string;
  password: string;
  database: string;
  host: {
    address: string;
    port: number;
    dialect: Dialect;  
  }
}