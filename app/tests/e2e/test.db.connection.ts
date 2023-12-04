import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.TEST_DATABASE_HOST,
  port: parseInt(process.env.TEST_DATABASE_PORT),
  username: process.env.TEST_DATABASE_USERNAME,
  password: process.env.TEST_DATABASE_PASSWORD,
  database: process.env.TEST_DATABASE_NAME,
  entities: [__dirname + '/../../src/v1/data/orm_models/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  ssl: false,
  migrationsTableName: 'migration_audit',
});

export default testDataSource;
