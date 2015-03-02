'use strict';
var React = require('react');
var DeckStore = require('../stores/DeckStore');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//SlideWiki components
var dateFormat = require('../assets/js/dateformat');
var ContentMenu = require('./ContentMenu.jsx');
var TranslationButton = require('./TranslationButton.jsx');


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
      return {
        content: this.getStore(DeckStore).getContent(),
        theme_name: 'night',
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    startShow : function(){
      this.props.context.executeAction(navigateAction, {type: 'click', url : '/play/'+this.state.content.id+'/' + this.state.theme_name});
    },
    _handleChange: function(field, e){
        var content = this.state.content;
        content[field] = e.target.value;
        this.setState({content : content});
    },
    
  render: function(){
      var description = this.state.content.description || 'Provide description...';
      var origin = this.state.content.origin;
      var self = this;
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
                        <div className="ui attached segment">
                            <form className="ui form">
                                <div className="field">
                                <label>Abstract</label>
                                <textarea value={description} onChange = {self._handleChange.bind(this, 'description')}></textarea>
                                </div>

                            </form>
                        </div>
                        
                        
                    </div>
                </div>
            
       
     
              
              
              
              
              )
  }
});

module.exports = DeckEditor;


