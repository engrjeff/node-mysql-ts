CREATE DATABASE users_system;

CREATE TABLE `users_system`.`users`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `address` VARCHAR(45) NOT NULL,
    `postCode` VARCHAR(45) NOT NULL,
    `contactPhoneNumber` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `username` VARCHAR(45) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`id`)
);