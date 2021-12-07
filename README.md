# node-ts-be
Small backend REST API example for node written in typescript and with jwt authentication.

## how to install

Open a terminal and clone the repository into your folder:

```
git clone git@github.com:malahmen/node-ts-be.git
```

Create a .env file in the root folder.

```bash
touch .env

```
Define the following variables in it:

```
HOST='localhost'
PORT='3000'
DB_HOST='127.0.0.1'
DB_PORT='59535'
DB_USER='root'
DB_PASSWORD='your-password'
DB_NAME='your-database-name'
DB_DIALECT='mysql'
AUTH_SECRET='this-is-here-only-for-development-purposes'
AUTH_TOKEN_TTL='86400'
```

_I had a kubernetes service runing on localhost, hence the `DB_HOST` and `DB_PORT` values._

_If you have a local mysql DB, just use `localhost` and `3306` as values._

Run the following command:

```bash
npm i
```

## how to run the code

Open a terminal in the root folder and run the command:

```bash
cls && npm run dev
```