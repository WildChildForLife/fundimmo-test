const express = require('express');

let router = express.Router();

let logger = (pool) => router.use((req, res, next) => {
    res.on('finish', () => {
        let ip = ((req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0]);
        // LOGGING
        pool.getConnection().then(connection => {
            connection.query("INSERT INTO logs (createdAt, ip, type, url, status) VALUES (?, ?, ?, ?, ?)", [
                new Date().getTime(),
                ip,
                req.method,
                req.url,
                res.statusCode
            ]).catch(err => {
                throw err;
            }).finally(res => {
                connection.end();
                next();
            });
        }).catch(err => {
            throw err;
        });
    });

    next();
});

module.exports = logger;
