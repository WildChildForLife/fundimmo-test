const express                     = require('express');
const app                         = express();
const bodyParser                  = require('body-parser');
const axios                       = require('axios');
const mariadb                     = require('mariadb');

const countriesHandler            = require('./utils/countries-handler');
const config                      = require('./utils/config');

const pool                        = mariadb.createPool(config.database);
const logger                      = require('./utils/logger')(pool);
const numberLastLogs              = 20;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

let router = express.Router();

// Log all the requests
app.use(logger);

// Allow CORS for communication through different servers (FRONT & BACK)
app.use((req, res, next) => {
    var allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

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
    let offset = (page === 1) ? 0 : (page * config.countriesPerPage);

    pool.getConnection().then(connection => {
        // id >= OFFSET is more powerful than using ORDER BY LIMIT OFFSET : https://mariadb.com/kb/en/library/pagination-optimization/
        connection.query("SELECT * FROM countries WHERE id >= ? LIMIT ?", [offset, config.countriesPerPage]).then((rows) => {
            connection.end();
            if (rows.length === 0) {
                res.status(404).send("Page not found");

                return;
            }

            res.json(countriesHandler.parseCountries(rows));
        }).catch(err => {
            connection.end();
            throw err;
        });
    }).catch(err => {
        throw err;
    });

}).get('/pays/:name', (req, res) => {
    pool.getConnection().then(connection => {
        connection.query('SELECT * FROM countries c WHERE c.name LIKE ?', req.params.name + '%').then((row) => {
            connection.end();
            if (row.length === 0) {
                res.status(404).send("Country not found");
            }
            res.json(countriesHandler.parseCountries(row));

            return;
        }).catch(err => {
            connection.end();
            throw err;
        });
    }).catch(err => {
        throw err;
    });

}).get('/pays/id/:id', (req, res) => {
    pool.getConnection().then(connection => {
         connection.query('SELECT * FROM countries c WHERE c.id = ?', req.params.id).then((row) => {
             connection.end();
             if (typeof row[0] === "undefined" || typeof row[0].name === "undefined") {

                res.status(404).send("Country not found");

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
    }).catch(err => {
        throw err;
    });

}).put('/pays/id/:id', (req, httpResponse) => {
    pool.getConnection().then( connection => {
        connection.query('SELECT * FROM countries c WHERE c.id = ?', req.params.id).then((row) => {
            connection.end();
            if (typeof row[0] === "undefined" || typeof row[0].name === "undefined") {
                httpResponse.status(404).send("Country not found");

                return;
            }

            // If no field has been sent for update, return the non-updated data from the base, just like a Get !
            if (Object.entries(req.body).length === 0) {
                httpResponse.json(countriesHandler.parseCountries(row));

                return;
            }

            let update = countriesHandler.getDataToUpdate(req.body);
            let countryId = row[0].id;
            update.values.push(countryId);

            connection.query("UPDATE countries SET " + update.keys + " WHERE id = ?", update.values).then((res) => {
                connection.end();
                // If the country has been updated, redirect to show the updated country + its weather
                if (res.affectedRows == 1) {
                    httpResponse.redirect('/pays/id/' + countryId);
                }
            }).catch(err => {
                connection.end();
                throw err;
            });
        }).catch(err => {
            connection.end();
            throw err;
        });
    }).catch(err => {
        throw err;
    });

}).get('/logs', (req, res) => {
    pool.getConnection().then(connection => {
        connection.query('SELECT * FROM logs l ORDER BY l.id DESC LIMIT 0,?', numberLastLogs).then((rows) => {
            if (typeof rows[0] === "undefined" || typeof rows[0].id === "undefined") {
                connection.end();
                res.status(404).send("No logs yet.");

                return;
            }

            connection.end();
            res.json(rows);
        }).catch(err => {
            connection.end();
            throw err;
        });
    }).catch(err => {
        throw err;
    });
}).get('/import-countries', (httpRequest, httpResponse) => {
    pool.getConnection().then(connection => {
         axios.get(config.countriesRestApi).then(body => {
            let dataToInsert = countriesHandler.parseDataToInsert(body.data);

            // FLUSH TABLE
            connection.query('TRUNCATE TABLE countries').then((res) => {
                connection.query('ALTER TABLE countries AUTO_INCREMENT = 1').then((res) => {
                    let keys = Object.keys(countriesHandler.schema.countries).join(', ');
                    let values = '?' + ', ?'.repeat(Object.keys(countriesHandler.schema.countries).length - 1);

                    connection.batch('INSERT INTO countries (' + keys + ') VALUES (' + values +')', dataToInsert).then((res) => {
                        connection.end();
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
        throw err;
    });
});

app.use('/', router);

app.listen(port);