'use strict';
var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
//stores
var DeckSliderStore = require('../stores/DeckSliderStore');
//actions
var navigateAction = require('flux-router-component/actions/navigate');

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
        last: this.getStore(DeckSliderStore).getLastSlide()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    _getPrevPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.previous.id;
    },
    _getNextPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.next.id;
    },
    _getFirstPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.first.id;
    },
    _getLastPath: function() {
      return "/deck/"+ this.state.deckID +"/slide/" + this.state.last.id;
    },
    _onPrevClick: function(e) {
      this.props.context.executeAction(navigateAction, {path: this._getPrevPath()});
      e.preventDefault();
    },
    _onNextClick: function(e) {
      this.props.context.executeAction(navigateAction, {path: this._getNextPath()});
      e.preventDefault();
    },
    _onLastClick: function() {
      this.props.context.executeAction(navigateAction, {path: this._getLastPath()});
      e.preventDefault();
    },
    _onFirstClick: function() {
      this.props.context.executeAction(navigateAction, {path: this._getFirstPath()});
      e.preventDefault();
    },
    _onFullscreenClick: function() {

    },
    render: function() {
      if(!this.state.visible){
        return (null);
      }else{

      var deckID=this.state.deckID;
      //hide control if no current slide is defined!
        var prevElement="";
        if(this.state.previous){
          var prevPath=this._getPrevPath();
          prevElement=<div className="ui button" onClick={this._onPrevClick} title="previous"><i className="caret left icon"></i> </div>;
        }else{
          prevElement=<div className="ui button"><i className="caret left icon disabled"></i></div>;
        }
        var nextElement="";
        if(this.state.next){
          var nextPath=this._getNextPath();
          nextElement=<div className="ui button" onClick={this._onNextClick} title="next"><i className="icon caret right"></i></div>;
        }else{
          nextElement=  <div className="ui button"><i className="icon caret right disabled"></i></div>;
        }
        var firstElement=<div className="ui button" onClick={this._onFirstClick}><i className="icon step backward"></i></div>
        var lastElement=<div className="ui button" onClick={this._onLastClick}><i className="icon step forward"></i></div>
        return (
          <div className="sw-slidercontrol-panel">
            <div className="panel">
              <div className="ui secondary top green attached segment">
              SliderControlPanel
              </div>
              <div className="ui secondary bottom attached segment center aligned">
                <div className="bottom attached compact ui icon buttons">
                {firstElement}
                {prevElement}
                <div className="ui blue button">{this.state.current.index}/{this.state.slidesnumber}</div>
                {nextElement}
                {lastElement}
                <div className="ui teal button" onClick={this._onFullscreenClick}><i className="icon maximize"></i></div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
});

module.exports = SliderControl;