const countriesRestApi = 'https://restcountries.eu/rest/v2/all';
const database         = {
  host: 'db',
  user: 'root',
  password: 'secured',
  port: 3306,
  database: 'fundimmo',
  connectionLimit: 10
};

const limitGetCountries = 20;

module.exports = { countriesRestApi, database, limitGetCountries };