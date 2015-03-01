'use strict';
var createStore = require('fluxible/utils/createStore');


module.exports = createStore({
  storeName: 'ContributorsStore',
  handlers: {
    'SHOW_CONTRIBUTORS_START': '_showContributorsStart',
    'SHOW_CONTRIBUTORS_FAILURE': '_showContributorsFailure',
    'SHOW_CONTRIBUTORS_SUCCESS': '_showContributorsSuccess'
  },
  initialize: function () {
    this.contributors=[];
    this.selector = {};
  },
  _showContributorsStart: function (res) {
    //console.log('Start loading contributors...');
  },
  _showContributorsFailure: function (res) {
    
    this.error = res;
    this.emitChange();
  },
  _showContributorsSuccess: function (res) {
    this.contributors = res.contributors;
    this.selector = res.selector;
    this.emitChange();
  },
  isAlreadyComplete: function(selector) {
      
      if (this.selector){
          if (this.contributors.length && selector.id === this.selector.id && selector.type === this.selector.type) {
            //not empty
            return true;
          } else {
            return false;
          }
      }    
  },
  getContributors: function () {
    return this.contributors;
  },
  getError: function() {
    return this.error;
  },
  dehydrate: function () {
    return {
      contributors: this.contributors,
      selector: this.selector
    };
  },
  rehydrate: function (state) {
    this.contributors = state.contributors;
    this.selector = state.selector;
  }
  
});
