const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const fetch      = require('fetch');
const mariadb    = require('mariadb');
const pool       = mariadb.createPool({host: 'db', user: 'root', password: 'secured', port: 3306, database: 'fundimmo', connectionLimit: 10});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

let router = express.Router();

const countriesRestApi = 'https://restcountries.eu/rest/v2/all';
const schema = {
    countries: [
        'name',
        'topLevelDomain',
        'alpha2Code',
        'alpha3Code',
        'capital',
        'altSpellings',
        'region',
        'subregion',
        'population',
        'latlng',
        'demonym',
        'area',
        'gini',
        'timezones',
        'borders',
        'nativeName',
        'numericCode',
        'flag',
        'cioc'
    ],
    currencies : [
        'country_id',
        'code',
        'name',
        'symbol'
    ],
    languages: [
        'country_id',
        'iso639_1',
        'iso639_2',
        'name',
        'nativeName'
    ],
    regionalBlocs: [
        'country_id',
        'acronym',
        'name',
        'otherAcronyms',
        'otherNames'
    ],
    translations: [
        'country_id',
        'de',
        'es',
        'fr',
        'ja',
        'it',
        'br',
        'pt',
        'nl',
        'hr',
        'fa'
    ]
};

router.get('/', (req, res) => {

}).get('/import-countries', async (req, res) => {
    let connection;
    try {
        pool.getConnection().then(connection => {
            fetch.fetchUrl(countriesRestApi, (error, meta, body) => {
                let result = JSON.parse(body.toString());
                // Begin transaction to insert in Bulk
                connection.beginTransaction();
                let prepareInsert = [];
                let index = 1;
                // List of countries
                result.forEach((country) => {
                    if (index === 1) {
                        console.log(country);
                    }
                    let prepareSubInsert = [index];
                    let subIndex = 0;
                    // Attribute countries
                    Object.entries(country).forEach((value) => {

                        if (value.length > 1 && schema.countries.includes(value[0])) {
                            prepareSubInsert.push(value[1]);
                        }
                        subIndex++;
                    });
                    console.log(prepareSubInsert.length);
                    prepareInsert.push(prepareSubInsert);
                    index++;
                });


                try {
                    const res = connection.batch("INSERT INTO countries value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", prepareInsert);

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

app.use('/api', router);

app.listen(port);