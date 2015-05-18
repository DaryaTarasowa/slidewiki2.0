'use strict';
var createStore = require('fluxible/utils/createStore');
var routesConfig = require('../configs/routes');
var agent = require('superagent');
var api = require('../configs/config').api;
//error messages: 
var internal =  {message : 'An internal error occured, please try one more time'};


var ApplicationStore = createStore({
    storeName: 'ApplicationStore',
    handlers: {
        'CHANGE_ROUTE_SUCCESS': '_handleNavigate',
        'UPDATE_PAGE_TITLE': 'updatePageTitle',
        'GOOGLE_LANGUAGES_FAILURE' : 'googleLanguagesFailure',
        GOOGLE_LANGUAGES_SUCCESS : 'googleLanguagesSuccess'
    },
    initialize: function(dispatcher) {
        this.currentRoute = null;
        this.routes = routesConfig;
        this.pageTitle = '';
        this.googleLanguages = {};
    },
//    _loadGoogleLanguages: function(){
//        var self = this;
//        agent
//            .get(api.path + '/languages/')
//            .end(function(err, res){
//                if (err){
//                    self.error = internal;
//                    return self.emitChange();
//                }else{
//                    self.googleLanguages = res.body;
//                   self.emitChange();
//                }
//            });
//    },
    googleLanguagesFailure : function(err){
        console.log(err);
    },
    googleLanguagesSuccess : function(response){
        this.googleLanguages = response.languages;
        this.emitChange();
    },
  _handleNavigate: function(route) {
    
    if (this._isTheCurrentRoute(route)) {
      return;
    }
    this.currentRoute = route;
    this.emitChange();
  },
  updatePageTitle: function(title) {
    
    this.pageTitle = title.pageTitle;
    this.emitChange();
  },
  _isTheCurrentRoute: function(route) {
    if (this.currentRoute && route.url == this.currentRoute.path) {
      return true;
    } else {
      return false;
    }
  },
  getCurrentPageLabel: function() {
    if (this.currentRoute)
      return this.routes[this.currentRoute.name].label;
  },
  getPageTitle: function() {
    return this.pageTitle;
  },
  getGoogleLanguages : function(){
      return this.googleLanguages;
  },
  getState: function() {
    return {
      route: this.currentRoute,
      routes: this.routes,
      pageTitle: this.pageTitle,
      googleLanguages: this.googleLanguages
    };
  },
  dehydrate: function() {
    return this.getState();
  },
  rehydrate: function(state) {
    this.routes = state.routes;
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle;
    this.googleLanguages = state.googleLanguages;
  }
});


module.exports = ApplicationStore;
