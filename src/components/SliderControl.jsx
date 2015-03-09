'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
//stores
var DeckSliderStore = require('../stores/DeckSliderStore');
var TreeStore = require('../stores/TreeStore');
//actions
var navigateAction = require('flux-router-component/actions/navigate');
var deckActions = require('../actions/DeckActions');

var SliderControl = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckSliderStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
        
      return {
        visible:this.getStore(DeckSliderStore).isVisible(),
        slidesnumber: this.getStore(DeckSliderStore).getSlidesNumber(),
        deckID: this.getStore(DeckSliderStore).getDeckID(),
        next: this.getStore(DeckSliderStore).getNextSlide(),
        previous: this.getStore(DeckSliderStore).getPreviousSlide(),
        current: this.getStore(DeckSliderStore).getCurrentSlide(),
        first: this.getStore(DeckSliderStore).getFirstSlide(),
        last: this.getStore(DeckSliderStore).getLastSlide(),
        selector: this.getStore(TreeStore).getSelector(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
//    _getPrevPath: function() {
//      return "/deck/"+ this.state.deckID +"/slide/" + this.state.previous.id;
//    },
//    _getNextPath: function() {
//      return "/deck/"+ this.state.deckID +"/slide/" + this.state.next.id;
//    },
//    _getFirstPath: function() {
//      return "/deck/"+ this.state.deckID +"/slide/" + this.state.first.id;
//    },
//    _getLastPath: function() {
//      return "/deck/"+ this.state.deckID +"/slide/" + this.state.last.id;
//    },
    _onPrevClick: function(e) {
      if(this.state.previous){
        this.props.context.executeAction(deckActions.loadUpdateTree, {deck: this.state.deckID, selector: {type: 'slide', id: this.state.previous.id, mode: this.state.selector.mode}} );
      }
      e.preventDefault();
    },
    _onNextClick: function(e) {
      if(this.state.next){
        this.props.context.executeAction(deckActions.loadUpdateTree, {deck: this.state.deckID, selector: {type: 'slide', id: this.state.next.id, mode: this.state.selector.mode}} );
      }
      e.preventDefault();
    },
    _onLastClick: function() {
      this.props.context.executeAction(deckActions.loadUpdateTree, {deck: this.state.deckID, selector: {type: 'slide', id: this.state.last.id, mode: this.state.selector.mode}} );
      e.preventDefault();
    },
    _onFirstClick: function() {
      this.props.context.executeAction(deckActions.loadUpdateTree, {deck: this.state.deckID, selector: {type: 'slide', id: this.state.first.id, mode: this.state.selector.mode}} );
      e.preventDefault();
    },
    _onFullscreenClick: function() {
      var elem = document.getElementById('sw_slide');
      if (screenfull.enabled) {
        //go to fullscreen mode
        elem.className += " sw-slide-fullscreen"
        screenfull.request(elem);
        //listen to fullscreen changes
        document.addEventListener(screenfull.raw.fullscreenchange, function () {
          if (!screenfull.isFullscreen) {
            var re = / sw-slide-fullscreen/gi;
            var newClasses=elem.className.replace(re, "");
            elem.className=newClasses
          }
        });
      }
    },
    _updateProgressbar: function() {
      if(this.state.visible){
        var percentage=(this.state.current.index/this.state.slidesnumber)*100;
        var progressbar = this.refs.progressbar.getDOMNode();
        //the following part only executes when javascript is enabled!
        $(progressbar).progress({percent: percentage});
        //$(progressbar).show();
      }
    },
    render: function() {
      if(!this.state.visible){
        return (null);
      }else{

      var deckID=this.state.deckID;
      //hide control if no current slide is defined!
        var prevElement="";
        if(this.state.previous){         
          prevElement=<div className="ui button" onClick={this._onPrevClick} title="previous"><i className="caret left icon"></i> </div>;
        }else{
          prevElement=<div className="ui button"><i className="caret left icon disabled"></i></div>;
        }
        var nextElement="";
        if(this.state.next){       
          nextElement=<div className="ui button" onClick={this._onNextClick} title="next"><i className="icon caret right"></i></div>;
        }else{
          nextElement=  <div className="ui button"><i className="icon caret right disabled"></i></div>;
        }
        var firstElement=<div className="ui button" onClick={this._onFirstClick}><i className="icon step backward"></i></div>
        var lastElement=<div className="ui button" onClick={this._onLastClick}><i className="icon step forward"></i></div>
        return (
          <div className="sw-slidercontrol-panel">
            <div className="panel">

              <div className="ui bottom attached progress" ref="progressbar">
                <div className="bar"></div>
              </div>

              <div className="ui bottom attached segment center aligned">
                <div className="compact ui icon buttons">
                {firstElement}
                {prevElement}
                <div className="ui blue button">{this.state.current.index}/{this.state.slidesnumber}</div>
                {nextElement}
                {lastElement}
                <div className="ui teal button" onClick={this._onFullscreenClick}><i className="icon expand"></i></div>
                </div>
              </div>

            </div>
          </div>
        );
      }
    },
    //executed only first time
    componentDidMount: function(){
      this._updateProgressbar();
      key('right', this._onNextClick);
      key('shift+right', this._onLastClick);
      key('left', this._onPrevClick);
      key('shift+left', this._onFirstClick);
    },
    componentWillUnmount: function(){
      key.unbind('right');
      key.unbind('shift+right');
      key.unbind('left');
      key.unbind('shift+left');
    },
    //executes every time component rerenders
    componentDidUpdate: function(){
      this._updateProgressbar();
    }
});

module.exports = SliderControl;
