const express                     = require('express');
const app                         = express();
const bodyParser                  = require('body-parser');
const axios                       = require('axios');
const mariadb                     = require('mariadb');

const countriesHandler            = require('./utils/countries-handler');
const config                      = require('./utils/config');
const pool                        = mariadb.createPool({
    host: 'db',
    user: 'root',
    password: 'secured',
    port: 3306,
    database: 'fundimmo',
    connectionLimit: 10
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

let router = express.Router();

router.get('/pays/:page?', (req, res, next) => {
    // If no page has been set, redirect to page 1
    let page = (req.params.page === undefined) ? 1 : req.params.page;
    // If a page has been set but not a number, it must be a name, redirect to the next valid GET function
    if (isNaN(page)) {
        next();

        return;
    }
    page = parseInt(page);

    // Define the offset according to the requested page number
    let offset = (page === 1) ? 0 : (page * config.limitGetCountries);

    pool.getConnection().then(connection => {
        // id >= OFFSET is more powerful than using ORDER BY LIMIT OFFSET : https://mariadb.com/kb/en/library/pagination-optimization/
        connection.query("SELECT * FROM countries WHERE id >= ? LIMIT ?", [offset, config.limitGetCountries]).then((rows) => {
            if (rows.length === 0) {
                connection.end();
                res.sendStatus(404);

                return;
            }

            res.json(countriesHandler.parseCountries(rows));
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).get('/pays/:name', (req, res) => {
    pool.getConnection().then(connection => {
        connection.query('SELECT * FROM countries c WHERE c.name LIKE ?', req.params.name + '%').then((row) => {
            res.json(countriesHandler.parseCountries(row));
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).get('/pays/id/:id', (req, res) => {
    pool.getConnection().then(connection => {
         connection.query('SELECT * FROM countries c WHERE c.id = ?', req.params.id).then((row) => {
            if (typeof row[0] === "undefined" || typeof row[0].name === "undefined") {
                connection.end();
                res.sendStatus(404);

                return;
            }

            row = countriesHandler.parseCountries(row);

            let params = {
                access_key: config.weatherAccessKey,
                query: row[0].name
            };

            axios.get(config.weatherApi, {params}).then((weather) => {
                res.json(countriesHandler.mergeWeather(row[0], weather.data));
            });
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).put('/pays/id/:id', (req, httpResponse) => {
    pool.getConnection().then( connection => {
        connection.query('SELECT * FROM countries c WHERE c.id = ?', req.params.id).then((row) => {
            if (typeof row[0] === "undefined" || typeof row[0].name === "undefined") {
                res.sendStatus(404);
                connection.end();

                return;
            }

            // If nothing has been updated, return the non-updated data from the base, just like a Get !
            if (Object.entries(req.body).length === 0) {
                res.json(countriesHandler.parseCountries(row));
                connection.end();

                return;
            }

            let update = countriesHandler.getDataToUpdate(req.body);
            let countryId = row[0].id;
            update.values.push(countryId);

            connection.query("UPDATE countries SET " + update.keys + " WHERE id = ?", update.values).then((res) => {
                // If the country has been updated, redirect to show the updated country + its weather
                if (res.affectedRows == 1) {
                    httpResponse.redirect('/pays/id/' + countryId);
                }
            });

            res.json(response);
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).get('/import-countries', (httpRequest, httpResponse) => {
    pool.getConnection().then(connection => {
         axios.get(config.countriesRestApi).then(body => {
            let result = body.data;

            let dataToInsert = countriesHandler.parseDataToInsert(result);

            // FLUSH TABLE
            connection.query('TRUNCATE TABLE countries').then((res) => {
                connection.query('ALTER TABLE countries AUTO_INCREMENT = 1').then((res) => {
                    let keys = Object.keys(countriesHandler.schema.countries).join(', ');
                    let values = '?' + ', ?'.repeat(Object.keys(countriesHandler.schema.countries).length - 1);

                    connection.batch('INSERT INTO countries (' + keys + ') VALUES (' + values +')', dataToInsert).then((res) => {
                        httpResponse.json(res);
                    }).catch(err => {
                        connection.end();
                        throw err;
                    });
                }).catch(err => {
                    connection.end();
                    throw err;
                });
            }).catch(err => {
                connection.end();
                throw err;
            });
        });
    }).catch(err => {
        connection.end();
        throw err;
    });
});

app.use('/', router);

app.listen(port);