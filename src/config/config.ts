import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config(); // para que cargue primeros las variables de entorno

export const config: ConfigModuleOptions = {
  validationSchema: Joi.object({
    DATABASE_HOST: Joi.required(),
    DATABASE_PORT: Joi.number().default(5432),
  }),
};

export const configTypeORM: TypeOrmModuleOptions = {
  type: 'postgres', // type of our database
  host: process.env.DATABASE_HOST, // database host
  port: +process.env.DATABASE_PORT, // database host
  username: process.env.DATABASE_USER, // username
  password: process.env.DATABASE_PASSWORD, // user password
  database: process.env.DATABASE_NAME, // name of our database,
  autoLoadEntities: true, // models will be loaded automatically
  synchronize: true, // your entities will be synced with the database(recommended: disable in prod)
};
