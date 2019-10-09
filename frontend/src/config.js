let fieldsDefinition = [
  {
    key: 'id',
    label: 'id',
    sortable: true
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    stickyColumn: true,
  },
  {
    key: 'flag',
    sortable: false,
    formatter: 'transformFlag',
  },
  {
    key: 'capital',
    sortable: false,
  },
  {
    key: 'region',
    sortable: false,
  },
  {
    key: 'subregion',
    sortable: false,
  },
  {
    key: 'area',
    sortable: false,
  },
  {
    key: 'topLevelDomain',
    sortable: false,
    formatter: 'arrayToList',
    disabled: true,
  },
  {
    key: 'alpha2Code',
    sortable: false,
    disabled: true,
  },
  {
    key: 'alpha3Code',
    sortable: false,
    disabled: true,
  },
  {
    key: 'callingCodes',
    sortable: false,
    formatter: 'arrayToList',
    disabled: true,
  },
  {
    key: 'altSpellings',
    sortable: false,
    formatter: 'arrayToList',
    disabled: true,
  },
  {
    key: 'population',
    sortable: false,
    disabled: true,
  },
  {
    key: 'latlng',
    sortable: false,
    disabled: true,
  },
  {
    key: 'demonym',
    sortable: false,
    disabled: true,
  },
  {
    key: 'timezones',
    sortable: false,
    formatter: 'arrayToList',
    disabled: true,

  },
  {
    key: 'gini',
    sortable: false,
    disabled: true,
  },
  {
    key: 'borders',
    sortable: false,
    formatter: 'arrayToList',
    disabled: true,
  },
  {
    key: 'nativeName',
    sortable: false,
    disabled: true,
  },
  {
    key: 'numericCode',
    sortable: false,
    disabled: true,
  },
  {
    key: 'currencies',
    sortable: false,
    formatter: 'arrayObjectToList',
    disabled: true,
  },
  {
    key: 'languages',
    sortable: false,
    formatter: 'arrayObjectToList',
    disabled: true,
  },
  {
    key: 'translations',
    sortable: false,
    formatter: 'arrayObjectToList',
    disabled: true,
  },
  {
    key: 'regionalBlocs',
    sortable: false,
    formatter: 'arrayObjectToList',
    disabled: true,
  },
  {
    key: 'cioc',
    sortable: false,
    disabled: true,
  },
  {
    key: 'weather',
    disabled: true,
    formatter: 'arrayObjectToList'
  }
];
const baseAPIUrl = 'http://127.0.0.1:3000/';
const apiUrlfetchCountries = baseAPIUrl + 'pays/';
const apiUrlImportCountries = baseAPIUrl + 'import-countries';
const unsplashConfig = {
  applicationId: 'bea201b3cd30ca48485007857a3d64ad85d70012422b48f1abcdea35053626b5',
  secret: '9ed93019e2c49c56168b7837d80e49a4315228a660a3f61674cf2c242293e31f'
};

export { fieldsDefinition, apiUrlfetchCountries, apiUrlImportCountries, unsplashConfig };
