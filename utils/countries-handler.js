const types = {
    int: 'int',
    varchar: 'varchar',
    text: 'text',
    bigint: 'bigint',
    float: 'float'
};

const schema = {
    countries:
    {
        name: types.varchar,
        topLevelDomain: types.text,
        alpha2Code: types.varchar,
        alpha3Code: types.varchar,
        callingCodes: types.text,
        capital: types.varchar,
        altSpellings: types.text,
        region: types.varchar,
        subregion: types.varchar,
        population: types.bigint,
        latlng: types.text,
        demonym: types.varchar,
        area: types.bigint,
        gini: types.float,
        timezones: types.text,
        borders: types.text,
        nativeName: types.varchar,
        numericCode: types.int,
        currencies: types.text,
        languages: types.text,
        translations: types.text,
        flag: types.text,
        regionalBlocs: types.text,
        cioc: types.varchar
    }
};

/**
 * Parse and validate countrie's data to insert them in a mariadb query
 *
 * @param listCountries
 *
 * @returns {Array}
 */
const parseDataToInsert = (listCountries) => {
    let prepareInsert = [];
    // List of countries
    listCountries.forEach((country) => {
        let prepareSubInsert = [];

        // Attribute countries
        Object.entries(country).forEach((line) => {
            if (line.length > 1) {
                let key = line[0];
                let value = line[1];
                if (Object.keys(schema.countries).includes(key)) {
                    let insert = value;
                    if (value) {
                        switch (schema.countries[key]) {
                            case types.int:
                                insert = parseInt(value);
                                break;
                            case types.bigint:
                                insert = parseInt(value);
                                break;
                            case types.varchar:
                                insert = value.toString();
                                break;
                            case types.float:
                                insert = parseFloat(value);
                                break;
                            case types.text:
                                insert = JSON.stringify(value);
                                break;
                        }
                    }

                    prepareSubInsert.push(insert);
                }
            }
        });
        prepareInsert.push(prepareSubInsert);
    });

    return prepareInsert;
};

/**
 * Parse data country to parse strings into Arrays & Objects
 *
 * @param listCountries
 * @returns {Array}
 */
const parseCountries = (listCountries) => {
    let result = [];
    listCountries.forEach((country) => {
        let subResult = {};
        Object.entries(country).forEach((line) => {
            let key = line[0];
            let value = line[1];
            if (schema.countries[key] === types.text) {
                value = JSON.parse(value);
            }

            subResult[key] = value;
        });

        result.push(subResult);
    });

    return result;
};

/**
 * Merge the countrie's weather into the countries data
 *
 * @param country
 * @param weather
 *
 * @returns {Array}
 */
const mergeWeather = (country, weather) => {
    country['weather'] = weather;

    return country;
};

/**
 * Validate the body's request according to the allowed fields and delete all the non-valid fields
 * then return the built string for MariaDB keys and the related values
 *
 *
 * @param body
 *
 * @returns {{keys: string, values: Array}}
 */
const getDataToUpdate = (body) => {
    let values = [];

    Object.entries(body).forEach((line) => {
        let key = line[0];
        let value = line[1];

        if (!Object.keys(schema.countries).includes(key)) {
            delete body[key];
        } else {
            values.push(value)
        }
    });

    let keys = Object.keys(body).join(' = ?, ') + ' = ?';

    return { keys: keys, values: values };
};

module.exports = { schema, parseDataToInsert, parseCountries, mergeWeather, getDataToUpdate };