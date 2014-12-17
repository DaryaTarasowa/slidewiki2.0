'use strict';
var React = require('react');
var DeckHeader = require('./DeckHeader.jsx');
var TreePanel = require('./TreePanel.jsx');
var ContentPanel = require('./ContentPanel.jsx');
var ContributorsPanel = require('./ContributorsPanel.jsx');
var SliderControl = require('./SliderControl.jsx');
var DeckNewsFeed = require('./DeckNewsFeed.jsx');

var DeckPage = React.createClass({
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
      if(!deckParams.stype || deckParams.stype=='deck'){
        deckNewsFeed=<DeckNewsFeed context={this.props.context} />
      }
        return (
          <div className="ui vertically padded grid page">
            <div className="row">
              <div className="column">
                <h2 className="ui header"><DeckHeader context={this.props.context} /></h2>
              </div>
            </div>

            <div className="ui hidden divider"></div>

            <div className="row">
              <div className="four wide column">
                <TreePanel context={this.props.context} />
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
                <ContributorsPanel context={this.props.context} />
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DeckPage;
