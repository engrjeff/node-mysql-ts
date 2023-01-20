import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import mysql from 'mysql2';

dotenv.config();

import UserModel from '../src/users/user.model';
import { CreateUserDto } from '../src/users/user.schema';

const DB_PASSWORD = process.env.DB_PWD;

const initializeDB = async () => {
  try {
    // CREATE THE DB
    const database = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
    });

    database.query('CREATE DATABASE users_system', (err, result) => {
      if (err) throw err;

      console.log('users_system database created');

      // CREATE USER TABLE
      database.query('USE users_system', (err, result) => {
        if (err) throw err;

        database.query(
          `CREATE TABLE users_system.users(
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`firstName\` VARCHAR(45) NOT NULL,
            \`lastName\` VARCHAR(45) NOT NULL,
            \`address\` VARCHAR(45) NOT NULL,
            \`postCode\` VARCHAR(45) NOT NULL,
            \`contactPhoneNumber\` VARCHAR(45) NOT NULL,
            \`email\` VARCHAR(45) NOT NULL,
            \`username\` VARCHAR(45) NOT NULL,
            \`password\` VARCHAR(200) NOT NULL,
            PRIMARY KEY (\`id\`)
)`,
          (err, result) => {
            if (err) throw err;

            console.log('user table created');

            // ALTER PERMISSIONS
            database.query(
              `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}'`,
              (err, result) => {
                if (err) throw err;

                console.log('permissions granted');

                // SEED 5 USERS
                const users: CreateUserDto[] = [1, 2, 3, 4, 5].map((n) => {
                  const firstName = faker.name.firstName();
                  const lastName = faker.name.lastName();
                  const username = `${firstName}_${lastName}`;

                  return {
                    firstName,
                    lastName,
                    username,
                    email: faker.internet.email(firstName, lastName),
                    address: faker.address.city(),
                    contactPhoneNumber: faker.phone.number(),
                    postCode: faker.address.zipCode('####'),
                    password: '123456',
                  };
                });

                Promise.all(
                  users.map(async (user) => {
                    return await UserModel.createUser(user);
                  })
                ).then((createdUsers) => {
                  console.log(`5 Users were seeded successfully`);
                  console.log(`You can use the ff. for login:`);
                  console.log('Email: ', createdUsers[0].email);
                  console.log('Password: ', '123456');

                  return createdUsers;
                });
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};

initializeDB();
