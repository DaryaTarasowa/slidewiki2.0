//'use strict';
//var React = require('react');
////stores
//
//var SlideView = React.createClass({
//    render: function() {
//
//        return (
//          <div className="sw-slide" id="sw_slide">
//            <div className="ui segment">
//              <div dangerouslySetInnerHTML={{__html: this.props.content.body}} />
//            </div>
//          </div>
//        );
//    }
//});




'use strict';
var React = require('react');
var SlideStore = require('../stores/SlideStore');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//SlideWiki components
var ContentMenu = require('./ContentMenu.jsx');
var TranslationButton = require('./TranslationButton.jsx');

var SlideView = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [SlideStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(SlideStore).getContent(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        return (
                <div className="sw-slide-panel">
                    <div className="panel">
                        <div className="ui top secondary blue attached segment">
                            <h3 className="ui header">
                                <div className="content">
                                    {this.state.content.title}
                                </div>
                            </h3>
                            <TranslationButton context = {this.props.context} content={this.state.content}/>
                        </div>
                        <ContentMenu startShow = {this.startShow} />
                        <div className="ui bottom attached segment">
                            <div className="sw-slide" id="sw_slide">
                                <div className="ui segment">
                                    <div dangerouslySetInnerHTML={{__html: this.state.content.body}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
       
          
        );
    }
});

module.exports = SlideView;

