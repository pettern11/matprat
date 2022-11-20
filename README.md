## Getting started

### Install necessary software

For this application to work you need node js.

Node.js can be downloaded here: https://nodejs.org/en/download/ 
 
<mark>If you already have Node.js, make sure you have the latest software</mark>


### Built With

* Node
* React
* Bootstrap
* Typescript

## Create databases for tests and the application

Create two databases, one for tests and one for the application. 

In the database for the application, Copy the `database.sql` file and run the mysql queries.

Head into the test database and Copy the `testdatabase.sql` file
located in `server/test` and run the mysql queries. 


### Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'database-host';
process.env.MYSQL_USER = 'username';
process.env.MYSQL_PASSWORD = 'password';
process.env.MYSQL_DATABASE = 'database_name';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'database-host';
process.env.MYSQL_USER = 'username';
process.env.MYSQL_PASSWORD = 'password';
process.env.MYSQL_DATABASE = 'test_database_name';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server 

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Download premade recipes

Download premade recipes to database. The scripts uses the information in the config.ts, this must be configured before you start.

<mark>The database must be empty for the script to work properly!</mark>


```sh
cd server
npm run addRecipes
```

### Run server tests:

```sh
cd server
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install --force
npm install react-select --force
npm start
```

### Run client tests:

```sh
cd client
npm test
```

## Creators

Martin Hvistendahl

Nicolai Sommerfelt

William Fagerstrøm

Petter Vestby
