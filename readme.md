# NodeJS API using MySQL

This project is created by Jeffrey E. Segovia.

## Tech Stack used

- NodeJS
- TypeScript
- MySQL
- Jest for basic tests

## Clone the Repo

You can start playing around with this project by first cloning its repository:

```shell
git clone https://github.com/engrjeff/node-mysql-ts.git
```

Open the root folder then install the dependencies:

```shell
npm install
```

## Database Initialization

> This assumes that the configs in `.env` file are the same as your MySQL instance.

Before running the project, make sure to create the database first. This can automaticall be done by running the ff:

```shell
npm run init:db
```

## Running the dev server

You can run the development server by running the ff:

```shell
npm run dev
```

## Running the basic tests

Run the basic tests by simply doing:

```shell
npm run test:watch
```

## Endpoints

The base URL is simply: `http://localhost:5000`

```shell
POST /login

GET /users
POST /users
DELETE /users?ids=1,2,3

GET /users/:id
PUT /users/:id
DELETE /users/:id
```

> Note that all `users` routes require an Authorization Header with the format: `Bearer [TOKEN]`. The value of the `token` can be taken from the `/login` response object.

-jeff
