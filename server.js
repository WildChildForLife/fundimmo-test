const express                     = require('express');
const app                         = express();
const bodyParser                  = require('body-parser');
const fetch                       = require('fetch');
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

    console.log('NOOOOOON');

    // Define the offset according to the requested page number
    let offset = (page === 1) ? 0 : (page * config.limitGetCountries);

    pool.getConnection().then(connection => {
        // id >= OFFSET is more powerful than using ORDER BY LIMIT OFFSET : https://mariadb.com/kb/en/library/pagination-optimization/
        connection.query("SELECT * FROM countries WHERE id >= ? LIMIT ?", [offset, config.limitGetCountries]).then((rows) => {
            if (rows.length === 0) {
                res.sendStatus(404);
            }

            res.json(countriesHandler.parseCountries(rows));
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).get('/pays/:name', (req, res) => {
    console.log(req.params.name);
    pool.getConnection().then(connection => {
        connection.query('SELECT * FROM countries c WHERE c.name LIKE ?', req.params.name + '%').then((rows) => {
            res.json(countriesHandler.parseCountries(rows));
        }).catch(err => {
            connection.end();
            throw err;
        });
    });

}).get('/import-countries', (req, res) => {
    let connection;
    try {
        pool.getConnection().then(connection => {
            fetch.fetchUrl(config.countriesRestApi, (error, meta, body) => {
                let result = JSON.parse(body.toString());
                // Begin transaction to insert in Bulk
                connection.beginTransaction();

                let dataToInsert = countriesHandler.importCountries(result);

                try {
                    // FLUSH TABLE
                    connection.query('TRUNCATE TABLE countries');
                    connection.query('ALTER TABLE countries AUTO_INCREMENT = 1');
                    const res = connection.batch('INSERT INTO countries (' + Object.keys(countriesHandler.schema.countries).join(', ') + ') VALUES (?' + ', ?'.repeat(Object.keys(countriesHandler.schema.countries).length - 1) +')', dataToInsert);

                    connection.commit();
                } catch (err) {
                    connection.rollback();
                    //handle error
                }

                return res.json();
            });
        });
    } catch (err) {
        throw err;
    } finally {
        if (connection) return connection.end();
    }
});

app.use('/', router);

app.listen(port);