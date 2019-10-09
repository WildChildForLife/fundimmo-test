<template>
  <div class="container-fluid">
    <div class="row">
      <!-- ASIDE BAR FOR 5 RECENT SEEN COUNTRIES -->
      <div class="aside-container left col-sm-3">
        <aside>
          <h2>Last 5 seen countries</h2>
          <ul class="list-countries">
            <template v-for="(value, name, index) in lastSeenCountries">
              <li class="side-country">
                <img :src="value.flag" :alt="value.name" class="image-aside" />
                <h4 class="aside-title">{{ value.name }}</h4>
              </li>
            </template>
          </ul>
        </aside>
      </div>
      <div class="left col-sm-9">
        <!-- TABLE FOR LIST OF COUNTRIES -->
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
        <!-- DETAILS ABOUT THE CLICKED COUNTRY -->
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
            <button class="close" v-on:click="hideDetails">
              <img src="https://image.flaticon.com/icons/svg/151/151882.svg" title="close" />
            </button>
          </div>
          <div class="randomPictures">
            <h2>Some random pictures about {{ countriesInfos.name }} : </h2>
            <div class="pictures" >
              <div class="row"v-html="pictures"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { methodsDefinition, fieldsDefinition } from './methodsDefinition';

  export default {
    name: 'app',
    data () {
      return {
        page: 1,
        showTable: true,
        countriesInfos: {},
        lastSeenCountries: [],
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
    methods: methodsDefinition,
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

  @media screen and (max-width: 576px) {
    .pictures img {
      width: 100%;
    }
  }

  h2 {
    margin: 30px 0;
  }

  @media screen and (max-width: 700px) {
    .aside-container {
      display:none;
    }
  }

  .image-aside {
    width: 50px;
    float: left;
    margin-right: 12px;
  }

  .aside-title {
    font-size: 18px;
    float: left;
    line-height: 35px;
  }

  .side-country {
    display: block !important;
    height: 46px;
  }
</style>
