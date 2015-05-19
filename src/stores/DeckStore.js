'use strict';
var createStore = require('fluxible/utils/createStore');
var agent = require('superagent');
var api = require('../configs/config').api;
//error messages: 
var internal =  {message : 'An internal error occured, please try one more time'};


module.exports = createStore({
  storeName: 'DeckStore',
  handlers: {
    'SHOW_DECK_START': '_showDeckStart',
    'SHOW_DECK_FAILURE': '_showDeckFailure',
    'SHOW_DECK_SUCCESS': '_showDeckSuccess',
    'TRANSLATE_TO' : 'translate_to',
    REDIRECT_COMPLETED : 'redirectCompleted',
    'GET_SLIDE_LIST_SUCCESS' : '_slideListSuccess'
  },
  initialize: function () {
    this.id = 0;
    this.content={};
    this.redirect = false;
    this.slides = [];
    this.languagesAvailable = [];
  },
  _showDeckStart: function (res) {
    //console.log('Start loading the deck content...');
  },
  _showDeckFailure: function (res) {
    console.log('Error loading the deck content!');
    this.error = res;
    this.emitChange();
  },
  _showDeckSuccess: function (res) {    
    this.id = res.id;
    this.content = res.content;
    this.languagesAvailable = res.languagesAvailable;
    this.emitChange();
  },
  _slideListSuccess: function(res){
      
  },
  redirectCompleted : function(){
      this.redirect = false;
      this.emitChange();
  },
  translate_to : function(payload){
      var self = this;
      agent
                .get(api.path + '/translate/' + payload.language + '/deck/' + payload.id)
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                        
                        self.id = res.body.id;
                        self.content = res.body;
                        self.redirect = true;
                        self.emitChange();
                    }
                });
     
    //todo(api/translate...) 
  },
  getContent: function (res) {
    return this.content;
  },
  getLanguagesAvailable: function(){
      return this.languagesAvailable;
  },
  getError: function() {
    return this.error;
  },
  getRedirect: function(){
      return this.redirect;
  },
  dehydrate: function () {
    return {
      id: this.id,
      content: this.content,
      redirect: this.redirect,
      languagesAvailable: this.languagesAvailable
    };
  },
  rehydrate: function (state) {
    this.id = state.id;
    this.content = state.content;
    this.redirect = state.redirect;
    this.languagesAvailable = state.languagesAvailable;
  }
});
