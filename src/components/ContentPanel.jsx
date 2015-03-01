'use strict';
var React = require('react');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//stores
var ContentStore = require('../stores/ContentStore');
var TreeStore = require('../stores/TreeStore');
//SlideWiki components
var DeckPanel=require('./DeckPanel.jsx');
var SlidePanel=require('./SlidePanel.jsx');
var SlideEditor = require('./SlideEditor.jsx');
var DeckEditor = require('./DeckEditor.jsx');
var deckActions = require('../actions/DeckActions');

var ContentPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [ContentStore, TreeStore]
      }
    },
    getInitialState: function () {
        return {
              content_type: 'deck',
              content_id: this.getStore(ContentStore).getContentID(),
              mode: this.getStore(TreeStore).getSelector().mode,
              theme_name: 'night'
          }

    },

    getStateFromStores: function () {
      return {
        content_type: this.getStore(ContentStore).getContentType(),
        content_id: this.getStore(ContentStore).getContentID(),
        mode: this.getStore(TreeStore).getSelector().mode,
        theme_name: 'night'
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
 
  startShow : function(){
      this.props.context.executeAction(navigateAction, {type: 'click', url : '/play/'+this.props.rootDeckID+'/' + this.state.theme_name});
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
        viewContent=<DeckPanel id={this.state.content_id} context={this.props.context} />;
        editContent=<DeckEditor id={this.state.content_id} context={this.props.context} />;
        break;
      case 'slide':
        viewContent=<SlidePanel id={this.state.content_id} context={this.props.context} />;
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
              <a className="item">
              Questions<span className="ui tiny label">12</span>
              </a>
              <div className="item">
                <a title="Comments">
                    <i className="comments red large icon"></i><span>5</span>
                </a>
              </div>
              <div className="item">
                <a title="download">
                  <i className="download icon"></i>
                </a>
                <a title="print">
                  <i className="print icon"></i>
                </a>
                <a title="export">
                  <i className="share external icon"></i>
                </a>
                <a title="share">
                  <i className="share alternate icon"></i>
                </a>
              </div>
              <div className="ui right labeled compact icon button green" onClick={this.startShow}>
                <i className="right play icon"></i>
                Play
              </div>
            </div>
            <div className={viewContentClasses}>
              <div className="ui segment">
                {viewContent}
              </div>
            </div>
            <div className={editContentClasses}>
              <div className="ui segment">
                <div className="ui segment color green">
                {editContent}
                </div>
              </div>
            </div>
          </div>
        );
    },
    //componentDidMount: function() {
    //    var payload = {deck:this.props.rootDeckID, mode: 'view', selector : {id :this.props.rootDeckID, type: 'deck'}};
    //    this.props.context.executeAction(deckActions.loadContainer, payload);
    //}
});

module.exports = ContentPanel;
