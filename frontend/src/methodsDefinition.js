import axios from 'axios';
import Unsplash, { toJson } from 'unsplash-js';
import { fieldsDefinition, apiUrlfetchCountries, apiUrlImportCountries, unsplashConfig } from './config';



let methodsDefinition = {
  /**
   * Filter the displayed countries by text area
   */
  filterCountries() {
    this.countries = this.keyword
      ? this.countriesCopy.filter(item => item.name.includes(this.keyword))
      : this.countriesCopy;
  },
  /**
   * Transform a JS Array into a pretty html list
   *
   * @param value
   * @param key
   * @param item
   * @returns {string}
   */
  arrayToList(value, key, item) {
    if (!item) return;
    if (value.length === 1) return value.toString();
    let stringToReturn = '';
    value.forEach((value) => {
      stringToReturn += '- ' + value + '<br />';
    });

    return stringToReturn;
  },
  /**
   * Transform a JS Array of objects into a pretty html list
   *
   * @param value
   * @param key
   * @param item
   * @returns {string}
   */
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
  /**
   * Transforms a countries flag url into an image
   *
   * @param value
   * @param key
   * @param item
   * @returns {string}
   */
  transformFlag(value, key, item) {
    return '<img src="' + value + '" title="' + item.name + '" width="100px">';
  },
  /**
   * Get country by page
   *
   * @param page
   */
  fetchCountries(page) {
    this.isBusy = true;
    axios.get(apiUrlfetchCountries + page).then((response) => {
      this.countries = response.data;
      this.countriesCopy = response.data;
      this.isBusy = false;
      this.keyword = '';
    }).catch(err => {
      // if nothing is to be displayed, means that the DB is empty, lets import countries into our DB
      axios.get(apiUrlImportCountries);
    });
  },
  /**
   * Show countrie's details with some random pictures from Unsplash
   *
   * @param row
   */
  showDetails(row) {
    this.showTable = false;
    this.pictures = '';
    const unsplash = new Unsplash(unsplashConfig);

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

    if (!this.lastSeenCountries.some(e => e.name === row.name)) {
      this.lastSeenCountries.push(row);
      if (this.lastSeenCountries.length > 5) {
        this.lastSeenCountries.shift();
      }
    }
  },
  /**
   * Hide details when the button close is clicked
   */
  hideDetails() {
    this.showTable = true;
  }
};

export { methodsDefinition, fieldsDefinition };
