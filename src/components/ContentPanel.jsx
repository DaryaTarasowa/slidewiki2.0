'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//stores
var ContentStore = require('../stores/ContentStore');
var TreeStore = require('../stores/TreeStore');
//SlideWiki components
var SlidePanel=require('./SlidePanel.jsx');
var SlideEditor = require('./SlideEditor.jsx');
var DeckEditor = require('./DeckEditor.jsx');
var DeckView=require('./DeckView.jsx');
var SlideView=require('./SlideView.jsx');
var deckActions = require('../actions/DeckActions');
var DeckStore = require('../stores/DeckStore');
var ApplicationStore = require('../stores/ApplicationStore'); //for loading languages list

var ContentPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [ContentStore, TreeStore, DeckStore, ApplicationStore]
      }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content_type: this.getStore(ContentStore).getContentType(),
        content_id: this.getStore(ContentStore).getContentID(),
        mode: this.getStore(TreeStore).getSelector().mode,        
        
      };
    },
    _onChange: function() {
        this.setState(this.getStateFromStores());
    },
    _onTabClick: function(mode, e) {
        this.props.context.executeAction(deckActions.loadUpdateTree, 
            {
                deck: this.props.rootDeckID, 
                selector: {
                    type: this.state.content_type,
                    id: this.state.content_id,
                    mode: mode
                }
            } );
        e.preventDefault();
    },
    
    
    render: function() {
      
      var viewTabClasses = cx({
        'item': true,
        'active': this.state.mode=='view'
      });
      var viewContentClasses= cx({
        'bottom': true,
        'attached': true,
        'panel': true,
        'sw-hidden': this.state.mode!='view'
      });
      var viewContent, editContent;
      switch(this.state.content_type){
      case 'deck':
        viewContent=<DeckView id={this.state.content_id} context={this.props.context} />;
        editContent=<DeckEditor id={this.state.content_id} context={this.props.context}  />;
        break;
      case 'slide':
        viewContent=<SlideView id={this.state.content_id} context={this.props.context} />;
        editContent=<SlideEditor id={this.state.content_id} context={this.props.context} />;
        break;
      }

        var editTabClasses = cx({
        'item': true,
        'active': this.state.mode=='edit'
      });
      var editContentClasses= cx({
        'bottom': true,
        'attached': true,
        'panel': true,
        'sw-hidden': this.state.mode!='edit'
      });
     
        return (
            <div className="sw-content-panel">
                <div className="ui top attached tabular menu">
                    <a  className={viewTabClasses} onClick={this._onTabClick.bind(this, 'view')}>
                        View
                    </a>
                    <a  className={editTabClasses} onClick={this._onTabClick.bind(this, 'edit')}>
                        Edit
                    </a>
                </div>  

                <div className={viewContentClasses}>
                    {viewContent}
                </div>
                <div className={editContentClasses}>
                    {editContent}
                </div>
            </div>
        );
    },

});



module.exports = ContentPanel;
