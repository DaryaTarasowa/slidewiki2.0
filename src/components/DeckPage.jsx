'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
var DeckHeader = require('./DeckHeader.jsx');
var TreePanel = require('./TreePanel.jsx');
var ContentPanel = require('./ContentPanel.jsx');
var ContributorsPanel = require('./ContributorsPanel.jsx');
var SliderControl = require('./SliderControl.jsx');
var DeckNewsFeed = require('./DeckNewsFeed.jsx');
var DeckStore = require('../stores/DeckStore');
var deckActions = require('../actions/DeckActions');

var async = require('async');

var DeckPage = React.createClass({
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
      return {
        error: this.getStore(DeckStore).getError(),
        theme_name: 'night',
      };
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
    render: function() {
      var output;
      var currentError = this.state.error;

      output = <DeckSuccess context={this.props.context} deckParams={this.props.deckParams}/>;
      if (currentError) {output = <DeckFailure context={this.props.context}/>}
            
      return (
            <div>{output}</div>   
        )
      },
    
});

var DeckFailure = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <h2 className="ui header">404 Page not found</h2>
                <p>Looks like the deck does not exist or there is some database problem.</p>
              </div>
            </div>
          </div>
        );
    }
});

var DeckSuccess = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
      var deckParams= this.props.deckParams;
      //show slider control only if a slide is selected
      var slider=null;
      if(deckParams.stype=='slide'){
        slider=<SliderControl context={this.props.context} />
      }
      //show news feed control only if a deck is selected
      var deckNewsFeed=null;
      if((!deckParams.stype || deckParams.stype=='deck') && (!deckParams.mode || deckParams.mode=='view')){
        deckNewsFeed=<DeckNewsFeed context={this.props.context} />
      }
        return (
                
          <div className="ui vertically padded grid page doubling stackable">
          
            <div className="row">
              <div className="column">
                <h2 className="ui header"><DeckHeader context={this.props.context} /></h2>
              </div>
            </div>

            <div className="ui hidden divider"></div>
           
               
            <div className="row">

              <div className="four wide column computer only tablet only">
                <TreePanel context={this.props.context} rootDeckID={this.props.deckParams.id}/>
              </div>

              
              <div className="nine wide column">
                <div className="row">
                  <ContentPanel context={this.props.context} rootDeckID={this.props.deckParams.id} />
                </div>
                <div className="row">
                  {slider}
                </div>
                <div className="row">
                  {deckNewsFeed}
                </div>
              </div>
              <div className="three wide column">
                <ContributorsPanel context={this.props.context} rootDeckID={this.props.deckParams.id}/>
              </div>
            </div>
          </div>
        );
    },
    
});

module.exports = DeckPage;
