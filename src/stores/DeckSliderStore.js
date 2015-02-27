'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');

module.exports = createStore({
  storeName: 'DeckSliderStore',
  handlers: {
    'SHOW_SLIDER_CONTROL_SUCCESS': '_showSliderControlSuccess',
    'SHOW_SLIDER_CONTROL_START': '_showSliderControlStart',
    'SHOW_SLIDER_CONTROL_START_FAILURE': '_showSliderControlFailure', //todo
    'UPDATE_SLIDER_CONTROL':'_updateSliderControl',
    'HIDE_SLIDER_CONTROL':'_hideSliderControl',
    'PLAY_DECK_SUCCESS': 'setSlides',
    PLAY_DECK_FAILURE: 'playDeckFailure',
    SET_THEME: 'setTheme'
  },
  initialize: function () {
    this.deckID=0;
    //a sequence of slides
    this.slides=[];
    this.currentSlide=0;
    this.visibility=1;
    this.theme='';
  },
  _hideSliderControl: function () {
    this.visibility=0;
    this.emitChange();
  },
  _getSlideIndex: function(id){
    var index = this.slides.map(function(x) {return parseInt(x.id); }).indexOf(id);
    return index;
  },
  setTheme : function(theme){
      this.theme = theme;
      this.emitChange();
  },
  
  _showSliderControlSuccess: function (res) {
    this.visibility=1;
    this.deckID= parseInt(res.deckID);
    this.slides= res.slides;
    var currentSlideID= parseInt(res.currentSlideID);
    var index = this._getSlideIndex(currentSlideID);
    this.currentSlide={index:index+1, id:currentSlideID};
    this.emitChange();
  },
  setSlides: function(res){
        this.deckID= parseInt(res.deckID);
        this.slides= res.slides;          
        this.emitChange();
  },
  playDeckFailure: function(){
      console.log('Play deck did not load slides');
  },
  _updateSliderControl: function (res) {
    this.visibility=1;
    var currentSlideID= parseInt(res.currentSlideID);
    var index = this._getSlideIndex(currentSlideID);
    this.currentSlide={index:index+1, id:currentSlideID};
    this.emitChange();
  },
  _showSliderControlStart: function (res) {
      console.log('Start loading the SliderController!');
  },
  _showSliderControlFailure: function (res) {
      console.log('Error loading the SliderController!');
  },
  isLastSlide: function (index) {
    return (index === this.slides.length);
  },
  isFirstSlide: function (index) {
    return (index === 1);
  },
  getNextSlide: function () {
    //check if slides are loaded
    if(!this.slides.length || !this.currentSlide){
      return 0;
    }else{
      if(this.isLastSlide(this.currentSlide.index)){
        return 0;
      }else{
        return {index:this.currentSlide.index+1, id: this.slides[this.currentSlide.index].id};
      }
    }
  },
  getPreviousSlide: function () {
    //check if slides are loaded
    if(!this.slides.length || !this.currentSlide || this.isFirstSlide(this.currentSlide.index)){
      return 0;
    }else{
      var slide=this.slides[this.currentSlide.index-2];
      return {index:this.currentSlide.index-1, id: slide.id};
    }
  },
  getCurrentSlide: function () {
      return this.currentSlide;
  },
  getFirstSlide: function () {
    if(!this.slides.length){
      return 0;
    }else{
      return {index:1, id: this.slides[0].id};
    }
  },
  getLastSlide: function () {
    if(!this.slides.length){
      return 0;
    }else{
      return {index:this.slides.length, id: this.slides[this.slides.length-1].id};
    }
  },
  getSlides: function () {
      //console.log(this.slides);
    return this.slides;
  },
  getSlidesNumber: function () {
    return this.slides.length;
  },
  getTheme: function(){
      return this.theme;
  },
  getDeckID: function () {
    return this.deckID;
  },
  //check to hide or show component
  isVisible: function () {
    return this.visibility;
  },
  getError: function() {
    return this.error;
  },
  //this method checks if we already received the slide list
  //it is used for preventing rendering/API calls on each request
  //todo: we can change this on update actions to reload slide list
  isAlreadyComplete: function() {
    if (!this.slides.length) {
      //empty
      return false;
    } else {
      return true;
    }
  },
  dehydrate: function () {
    return {
      deckID: this.deckID,
      slides: this.slides,
      currentSlide: this.currentSlide,
      theme: this.theme
    };
  },
  rehydrate: function (state) {
    this.deckID = state.deckID;
    this.slides = state.slides;
    this.currentSlide = state.currentSlide;
    this.theme = state.theme;
  }
});
