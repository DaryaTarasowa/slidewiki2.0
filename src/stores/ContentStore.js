'use strict';
var createStore = require('fluxible/utils/createStore');


module.exports = createStore({
  storeName: 'ContentStore',
  handlers: {
    'PREPARE_CONTENT_TYPE': '_prepareContentType',
    OPEN_CLOSE_GOOGLE_FORM: 'openCloseGoogleForm',
  },
  initialize: function () {
    this.content_type='';
    this.content_id=0;
    this.mode='view';
    this.isGoogleFormOpened=false;
  },
  _prepareContentType: function (res) {
    
    this.content_type = res.selector.type;
    this.content_id = res.selector.id;
    this.mode = res.selector.mode;
    this.emitChange();
  },
  openCloseGoogleForm: function(){
      this.isGoogleFormOpened = !this.isGoogleFormOpened;
      this.emitChange();
  },
  getContentType: function () {
    return this.content_type;
  },
  getContentID: function () {
    return this.content_id;
  },
  getMode: function () {
    return this.mode;
  },
  getIsGoogleFormOpened: function(){
      return this.isGoogleFormOpened;
  },
  dehydrate: function () {
    return {
      content_type: this.content_type,
      content_id: this.content_id,
      mode: this.mode,
      isGoogleFormOpened: this.isGoogleFormOpened
    };
  },
  rehydrate: function (state) {
    this.content_type = state.content_type;
    this.content_id = state.content_id;
    this.mode = state.mode;
    this.isGoogleFormOpened = state.isGoogleFormOpened;
  }
});
