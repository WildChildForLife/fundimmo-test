<template>
  <div class="container">
    <template v-if="showTable === true">
      <div class="table-container mt-3" v-show="showTable">
      <b-input-group align="center" class="search-input mt-3 mb-3 col-5" size="sm">
        <b-form-input v-on:keyup="filterCountries" v-model="keyword" placeholder="Country name" type="text"></b-form-input>
      </b-input-group>
      <b-table
        striped
        hover
        responsive
        id="list-countries"
        align="center"
        :busy="isBusy"
        :items="countries"
        :fields="fields"
        :keyword="keyword"
        :sticky-header="stickyHeader"
        :no-border-collapse="noCollapse"
        @row-clicked="showDetails" >
        <template v-slot:cell()="data">
          <span v-html="data.value"></span>
        </template>
      </b-table>
      <b-pagination
        :per-page="20"
        :total-rows="240"
        v-model="page"
        v-on:input="fetchCountries(page)"
        align="center"
        aria-controls="list-countries"
      ></b-pagination>
    </div>
    </template>
    <template v-else>
      <div class="infos" align="center">
        <div class="flag" v-html="countriesInfos.flag"></div>
        <div class="name"><b>{{ countriesInfos.name }}</b></div>
        <dl class="row">
          <template v-for="(value, name, index) in countriesInfos">
            <dt>{{ name + ' : ' }}</dt>
            <dd v-html="value"></dd>
          </template>
        </dl>
        <button class="close" v-on:click="hideDetails"><img src="src/assets/close.svg" title="close" /></button>
      </div>
      <div class="randomPictures">
        <h2>Some random pictures about {{ countriesInfos.name }} : </h2>
        <div class="pictures" >
          <div class="row"v-html="pictures"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import Unsplash, { toJson } from 'unsplash-js';

  const fieldsDefinition = [
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
    }
  ];

  export default {
    name: 'app',
    data () {
      return {
        page: 1,
        showTable: true,
        countriesInfos: {},
        pictures: '',
        stickyHeader: true,
        noCollapse: true,
        fields: fieldsDefinition.filter(item => item.disabled !== true),
        keyword: '',
        isBusy: false,
        countries: null,
        countriesCopy: null
      }
    },
    methods: {
      filterCountries() {
        this.countries = this.keyword
          ? this.countriesCopy.filter(item => item.name.includes(this.keyword))
          : this.countriesCopy;
      },
      arrayToList(value, key, item) {
        if (!item) return;
        if (value.length === 1) return value.toString();
        let stringToReturn = '';
        value.forEach((value) => {
          stringToReturn += '- ' + value + '<br />';
        });

        return stringToReturn;
      },
      arrayObjectToList(value, key, item) {
        if (!item || value === '') return;

        let stringToReturn = '';
        // List of objects
        if (!Array.isArray(value)) {
          stringToReturn = '';
          Object.keys(value).forEach((key) => {
            stringToReturn += '<span style="color: blue" >' + key.charAt(0).toUpperCase() + key.slice(1) + ' </span>: ' + value[key] + '<br />';
          });
        // List of Array Objects
        } else if (value.length > 0){
          stringToReturn = value.length > 1 ? '******<br />' : '';
          value.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
              stringToReturn += '<span style="color: blue" >' + key.charAt(0).toUpperCase() + key.slice(1) + ' </span>: ' + obj[key] + '<br />';
            });
            stringToReturn += value.length > 1 ? '******<br />' : '';
          });
        }

        return stringToReturn;
      },
      transformFlag(value, key, item) {
        return '<img src="' + value + '" title="' + item.name + '" width="100px">';
      },
      fetchCountries(page) {
        this.isBusy = true;
        axios.get('http://localhost:3000/pays/' + page).then((response) => {
          this.countries = response.data;
          this.countriesCopy = response.data;
          this.isBusy = false;
          this.keyword = '';
        });
      },
      showDetails(row) {
        this.showTable = false;
        this.pictures = '';
        const unsplash = new Unsplash({
          applicationId: "bea201b3cd30ca48485007857a3d64ad85d70012422b48f1abcdea35053626b5",
          secret: "9ed93019e2c49c56168b7837d80e49a4315228a660a3f61674cf2c242293e31f"
        });

        unsplash.search.photos(row.name, 1, 12).then(toJson).then((response) => {
          response.results.forEach((value) => {
            this.pictures += '<div class="col-sm-3"><img src="' + value.urls.small + '" title="' + row.name + '" /></div>';
          });
        });

        Object.entries(row).forEach((value) => {
          let rowKey = value[0];
          let rowValue = value[1];
          let formattedValue = rowValue;
          let filteredField = fieldsDefinition.filter(item => item.key === rowKey);
          let filteredObject = (filteredField.length > 0) ? fieldsDefinition.filter(item => item.key === rowKey)[0] : null;
          let formatter = (filteredObject !== null && 'formatter' in filteredObject) ? filteredObject.formatter : null;
          if (formatter !== null) {
            formattedValue = this[formatter](rowValue, 1, row);
          }

          this.countriesInfos[rowKey] = formattedValue;
        });
      },
      hideDetails() {
        this.showTable = true;
      }
    },
    mounted () {
      if (this.page === undefined) {
        this.page = 1;
      }

      this.fetchCountries(this.page);
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  table {
    width: 300px !important;
    margin-top: 0px;
  }

  .search-input {
    width: 400px;
    margin: auto;
  }

  .b-table-sticky-header {
    overflow-y: auto;
    max-height: 716px;
  }

  dl:after {content:"";display:table;clear:both;}
  dd {
    padding:.5em 0;
  }
  dl {
    width: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0
  }
  dt, dd {
    display:inline-block;
    width:30%;
  }
  dt {
    text-align:right;
    font-weight:bold;
    clear:left;
    float:left;
  }
  dd {
    width:70%;
    padding-left:1em;
    clear:right;
    text-align: left;
  }
  dd + dd {
    float:right;
    clear:both;
  }
  dt:first-child {
    padding-top:.5em;
  }
  dd + dt {
    clear:both;
    padding-top:.5em;
  }
  dt + dt {
    width: 100%;
    float: none;
    padding: 0 70% 0 0;
  }
  dt + dt + dd {
    margin-top: -2em;
  }
  dt + dt + dd + dt {
    margin-top: 2em;
  }

  .infos {
    position: relative;
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    margin: 10px;
    width: 30px;
  }

  .infos .flag img {
    margin-top: 40px;
    width: 200px;
  }

  .infos .name {
    margin-bottom: 40px;
  }

  dt:nth-child(even) + dd:nth-child(odd) {
    background: #fff;
  }
  dt:nth-child(odd) + dd:nth-child(even) {
    background: #eeeeee;
  }

  .pictures .col-sm-3 {
    max-height: 166px;
    margin-bottom: 22px;
    overflow: hidden;
  }

  h2 {
    margin: 30px 0;
  }
</style>
