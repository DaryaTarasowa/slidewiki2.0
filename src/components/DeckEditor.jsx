'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//stores
var ContentStore = require('../stores/ContentStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel.jsx');
var SlidePanel=require('./SlidePanel.jsx');
var SlideEditor = require('./SlideEditor.jsx');
var deckActions = require('../actions/DeckActions');


var DeckEditor = React.createClass({
  
  render: function(){
      return (<div>This is DeckEditor for deck {this.props.id}</div>)
  }
});

module.exports = DeckEditor;


