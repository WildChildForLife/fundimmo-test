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

let prepareInsert = [];

const countriesHandler = (listCountries) => {
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

module.exports = { schema, importCountries: countriesHandler, parseCountries };