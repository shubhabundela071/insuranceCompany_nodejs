//DB connection with Postgress (PgAdmin)
require('dotenv').config();
module.exports = {
  development: {
        client: 'pg',
        useNullAsDefault: true,
        migrations: {
            directory: "./../src/migrations"
        },
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};
