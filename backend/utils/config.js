const countriesRestApi = 'https://restcountries.eu/rest/v2/all';
const weatherApi       = 'http://api.weatherstack.com/current';
const weatherAccessKey = 'c7ce1196159d84af108bd8be56089b35';
const database         = {
  host: 'db',
  user: 'root',
  password: 'secured',
  port: 3306,
  database: 'fundimmo',
  connectionLimit: 10
};

const countriesPerPage = 20;

module.exports = { countriesRestApi, database, countriesPerPage, weatherApi, weatherAccessKey };