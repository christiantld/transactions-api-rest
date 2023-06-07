# 02-api-rest-nodejs

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Tools](#tools)

## About <a name = "about"></a>

This project is a simple API REST with NodeJS and Fastify. The main objective is to learn how to create an API REST with NodeJS and Fastify. The application is a simple CRUD of financial transactions. Some concepts that I learned in this project:

- Configure a Fastify server
- Create and use middlewares
- Setup routes and register them as Fastify plugins
- Use cookies on Fastify
- Setup a database connection with SQLite
- Write queries with Knex
- Validate schemas with Zod
- Tests E2E with Vitest and Supertest
- Work with environment variables with dotenv in NodeJS

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need to have installed NodeJS and NPM on your machine. You can download and install from [here](https://nodejs.org/en/download/).

You might want to use a HTTP client to test the API. I recommend [Insomnia](https://insomnia.rest/download) or [Postman](https://www.postman.com/downloads/).

### Installing

Once you have cloned the repository, you need to install the dependencies. You can do it with the following command:

```
npm install
```

Then, you need to create a `.env` file in the root of the project. You can copy the `.env.example` file and rename it to `.env`. This file contains the environment variables that the application needs to work. You can change the values of the variables if you want.

Finally, you need to run the migrations to create the database tables. You can do it with the following command:

```
npm run knex migrate:latest
```

End with an example of getting some data out of the system or using it for a little demo.

## Usage <a name = "usage"></a>

To start the application, you need to run the following command:

```
npm run dev
```

This command will start the application in development mode. The application will be listening on port 3333. You can change the port in the `.env` file.

Once the application is running, you can use the HTTP client to test the API.

The API has the following routes:

```
GET /transactions - List all transactions
POST /transactions - Create a new transaction
GET /transactions/:id - Show a transaction
GET /transactions/summary - Show a summary of the transactions
```

The API has the following schemas:

```
Transaction: {
id: string,
title: string,
amount: number,
type: 'credit' | 'debit',
session_id?: string,
created_at: string,
updated_at: string,
}
```

Transactions of type `credit` are transactions that add money to the account. Transactions of type `debit` are transactions that remove money from the account.

The `session_id` field is optional. This field is used to identify the user that created the transaction. A user can only see the transactions that he created with his session id.

## Tools <a name = "tools"></a>

- [NodeJS](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale.
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js.
- [SQLite](https://www.sqlite.org/index.html) - Self-contained, high-reliability, embedded, full-featured, public-domain, SQL database engine.
- [Knex](http://knexjs.org/) - A SQL query builder that is flexible, portable, and fun to use!
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference.
- [Vitest](https://vitest.dev/) - A simple, fast, and lightweight test runner for Node.js.
- [Supertest](https://www.npmjs.com/package/supertest) - A library for testing Node.js HTTP servers using a fluent API.
