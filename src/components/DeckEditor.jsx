'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//stores
var ContentStore = require('../stores/ContentStore');
var DeckStore = require('../stores/DeckStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel.jsx');
var SlidePanel=require('./SlidePanel.jsx');
var SlideEditor = require('./SlideEditor.jsx');
var deckActions = require('../actions/DeckActions');


var DeckEditor = React.createClass({
  mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
        console.log(this.getStore(DeckStore).getContent());
      return {
        content: this.getStore(DeckStore).getContent()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    _handleChangeDesc: function(e){
        var content = this.state.content;
        content.description = e.target.value;
        this.setState({content : content});
    },
    _handleChangeOrigin: function(e){
        var content = this.state.content;
        content.origin = e.target.value;
        this.setState({content : content});
    },
  render: function(){
      var description = this.state.content.description || 'Provide description...';
      var origin = this.state.content.origin;
      return (
            
            <form className="ui form">
                <div className="field">
                    <label>Abstract</label>
                    <textarea value={description} onChange = {this._handleChangeDesc}></textarea>
                </div>
                <div className="field">
                    <label>Origin</label>
                    <textarea value={origin} onChange = {this._handleChangeOrigin}></textarea>
                </div>
            </form>
       
     
              
              
              
              
              )
  }
});

module.exports = DeckEditor;


