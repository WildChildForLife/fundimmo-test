<template>
  <div class="mt-3">
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
      :no-border-collapse="noCollapse">
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

<script>
  import axios from 'axios';

  export default {
    name: 'app',
    data () {
      return {
        stickyHeader: true,
        noCollapse: true,
        fields: [
          {
            key: 'name',
            label: 'Name',
            sortable: true,
            stickyColumn: true,
          },
          {
            key: 'flag',
            sortable: false,
            formatter: 'transformFlag'
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
          /*{
            key: 'topLevelDomain',
            sortable: false,
            formatter: 'arrayToList'
          },
          {
            key: 'alpha2Code',
            sortable: false,
          },
          {
            key: 'alpha3Code',
            sortable: false,
          },
          {
            key: 'callingCodes',
            sortable: false,
            formatter: 'arrayToList'
          },
          {
            key: 'altSpellings',
            sortable: false,
            formatter: 'arrayToList'
          },


          {
            key: 'population',
            sortable: false,
          },
          {
            key: 'latlng',
            sortable: false,
          },
          {
            key: 'demonym',
            sortable: false,
          },
          {
            key: 'timezones',
            sortable: false,
            formatter: 'arrayToList'
          },

          {
            key: 'gini',
            sortable: false,
          },

          {
            key: 'borders',
            sortable: false,
            formatter: 'arrayToList'
          },
          {
            key: 'nativeName',
            sortable: false,
          },
          {
            key: 'numericCode',
            sortable: false,
          },
          {
            key: 'currencies',
            sortable: false,
            formatter: 'arrayObjectToList'
          },
          {
            key: 'languages',
            sortable: false,
            formatter: 'arrayObjectToList'
          },
          {
            key: 'translations',
            sortable: false,
            formatter: 'arrayObjectToList'
          },
          {
            key: 'regionalBlocs',
            sortable: false,
            formatter: 'arrayObjectToList'

          },
          {
            key: 'cioc',
            sortable: false,
          }*/
        ],
        keyword: '',
        isBusy: false,
        countries: null,
        countriesCopy: null,
        page: 1
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
          stringToReturn = '******<br />';
          value.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
              stringToReturn += '<span style="color: blue" >' + key.charAt(0).toUpperCase() + key.slice(1) + ' </span>: ' + obj[key] + '<br />';
            });
            stringToReturn += '******<br />';
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
      }
    },
    mounted () {
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
</style>
