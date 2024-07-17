const mysql = require('mysql2/promise');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SCHEMA } = require('./config');

async function conn() {
    try {
        const connection = await mysql.createConnection({
            user: DB_USER,
            password: DB_PASSWORD,
            host: DB_HOST,
            port: DB_PORT,
            database: DB_SCHEMA
        });

        console.log('Banco no ar');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}

module.exports = conn;