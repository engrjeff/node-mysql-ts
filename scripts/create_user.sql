/**
 * change the username as well as the password given to it
 */
-- CREATE USER 'users_system_api'@'localhost' IDENTIFIED BY '@jeffmysql19';

-- GRANT ALL PRIVILEGES ON users_system.users TO 'users_system_api'@'localhost';

-- flush privileges;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '@jeffmysql19'