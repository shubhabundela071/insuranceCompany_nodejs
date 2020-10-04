# NodeJS Coding Assignment (Insurance Company) and REST APIs

## System Requirement

* Node version >= v10.19.0
* NPM version >= 6.14.4
* Yarn version >= 1.13.0


## Getting Started

Clone the repo:
```sh
git clone https://github.com/shubhabundela071/insuranceCompany_nodejs.git
cd insuranceCompany_nodejs
```

Install dependencies:
```sh
npm i
```

Start server:
```sh

# Start server
nodemon

# DB Connetion and credentials
.env 

# Server listening port:
3000

# Selectively set DEBUG env var to get logs

Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.



Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch

# Run lint on any file change and try to fix problems
yarn lint:fix
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. npm i

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. npm i --production

# Use any process manager to start your services
4. pm2 start main.js
```

## Using Object-relational mapping 

Objection.js is an ORM for Node.js that aims to stay out of your way and make it as easy as possible to use the full power of SQL and the underlying database engine.

Objection.js, like Bookshelf, is built on the wonderful SQL query builder knex. All databases supported by knex are supported by objection.js. SQLite3, Postgres and MySQL are thoroughly tested.

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports.  A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. I just log to the console for simplicity, To do:- Can configure more transports as per requirement.

#### API logging
Logs detailed info about each api request to console during development.


#### Error logging
Logs stacktrace of error to console along with other details. 
