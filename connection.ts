import { Sequelize, Dialect, Options } from 'sequelize';
import { sequelizeConnectionConfig } from './interfaces/sequelizeConnectionConfig';

const service: sequelizeConnectionConfig = {
  user: process.env.DB_USER! as string,
  password: process.env.DB_PASSWORD! as string,
  database: process.env.DB_NAME! as string,
  host: {
    address: process.env.DB_HOST! as string,
    port: process.env.DB_PORT! as unknown as number,
    dialect: process.env.DB_DIALECT as Dialect,
  }
};

const sequelizeConnection = new Sequelize(service.database, service.user, service.password, service.host as Options);  

try {
  sequelizeConnection.authenticate();
  console.log('Connection to ' + service.host.address + ':' + service.host.port + ' has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database: ', JSON.stringify(error));
}

export default sequelizeConnection;