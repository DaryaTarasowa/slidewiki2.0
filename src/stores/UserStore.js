'use strict';
var createStore = require('fluxible/utils/createStore');

module.exports = createStore({
  storeName: 'UserStore',
  handlers: {
    'SHOW_USERS_FAILURE': '_showUsersFailure',
    'SHOW_USERS_SUCCESS': '_showUsersSuccess'
  },
  initialize: function () {
    this.ObjectData=[];
  },
  _showUsersFailure: function (res) {
    
    this.error = res;
    this.emitChange();
  },
  _showUsersSuccess: function (res) {
    this.ObjectData = res;
    this.emitChange();
  },
  getObject: function () {
    return this.ObjectData;
  },

  getError: function() {
    return this.error;
  },
  dehydrate: function () {
    return {
      ObjectData: this.ObjectData
    };
  },
  rehydrate: function (state) {
    this.ObjectData = state.ObjectData;
    
  }
  
});
