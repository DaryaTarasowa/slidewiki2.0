'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
//stores
var DeckStore = require('../stores/DeckStore');
var ApplicationStore = require('../stores/ApplicationStore'); //for loading languages list
//SlideWiki components
var DeckView=require('./DeckView.jsx');
var deckActions= require('../actions/DeckActions');
var treeActions= require('../actions/TreeActions');
var navigateAction = require('flux-router-component/actions/navigate');




var DeckPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckStore, ApplicationStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(DeckStore).getContent(),
        googleLanguages: this.getStore(ApplicationStore).getGoogleLanguages(),
        languageOpen: false,
        googleFormOpened : false,
        redirect: this.getStore(DeckStore).getRedirect(),
        theme_name: 'night',
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    openCloseLanguages: function(e){
        var state = this.state.languageOpen;
        var current = this.refs.world_icon.getDOMNode();
        if (!state){
            current.className += ' inverted';
        }else{
            var re = / inverted/gi;
            var newClasses=current.className.replace(re, "");
            current.className=newClasses
        }
        this.setState({languageOpen: !state});
    },
    openGoogleLanguagesTab : function(){        
        this.setState({googleFormOpened: true});
    },
    closeGoogleLanguages : function(){
        this.setState({googleFormOpened: false});
    },
    translateTo : function(language_code){
        var payload = {id : this.state.content.id, language: language_code};
        this.props.context.executeAction(deckActions.translateTo, payload);
    },
    shouldComponentUpdate : function(nextProps, nextState){ //after the translation we need to redirect to the new deck
        if (nextState.content.id !==this.state.content.id && nextState.redirect){
           this.props.context.executeAction(navigateAction, {type: 'click', url: '/deck/'+nextState.content.id});
           this.props.context.executeAction(deckActions.setRedirectFalse);
                return true;
        }else{
            return true;
        }
    },
    startShow : function(){
      this.props.context.executeAction(navigateAction, {type: 'click', url : '/play/'+this.props.id+'/' + this.state.theme_name});
    }, 
 
    render: function() {
        var self = this;
        var isGoogleFormOpened = this.state.googleFormOpened;
        var languageList;
        
        
        
        if (this.state.googleLanguages.length){
            languageList = this.state.googleLanguages.map(function(node, index){
            return (
                    <div key={node.language} className="ui fitted labeled three wide column sw-menu-link">
                        <a onClick={self.translateTo.bind(self, node.language)}>{node.name}</a>
                    </div> 
                )
            })
        }
        
        return (
              
                <div className="sw-slide-panel">
                    <div className="panel">
                        <div className="ui top secondary blue attached segment">
                            <h3 className="ui header" onClick={this.startShow}>
                                <div className="content">
                                    {this.state.content.title}
                                </div>
                            </h3>
                            <div className="ui dropdown right basic icon right labeled button top right attached label">
                                {this.state.content.language}
                                <i className="world icon blue" ref="world_icon" onClick={this.openCloseLanguages}></i>
                                <div className="menu vertical ui small fluid" ref="menu" style={{display: this.state.languageOpen ? 'block' : 'none'}}>
                                    <a className="item fitted vertically">Arabic</a> 
                                    <a className="item fitted vertically">Chinese</a> 
                                    <a className="item fitted vertically">Danish</a> 
                                    <div className="divider"></div>
                                    <div className="ui item" onClick={this.openGoogleLanguagesTab}>
                                        <i className="icon plane"></i>
                                        <span className="text">TRANSLATE</span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ui 7  fluid attached bottom small icon basic buttons">
                           
                            <div className="ui button" onClick={this.startShow}>
                                <a title="Slideshow">
                                    <i className="green play icon"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="Self-assessment questions">
                                    <i className="icon student purple"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="Comments">
                                    <i className="comments red icon"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="download">
                                  <i className="download icon"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="print">
                                  <i className="print icon"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="export">
                                  <i className="share external icon"></i>
                                </a>
                            </div>
                            <div className="ui button">
                                <a title="share">
                                  <i className="share alternate icon"></i>
                                </a>
                            </div>
                        </div>
                        <div className="ui attached segment">
                            <DeckView id={this.props.id} content={this.state.content} context={this.props.context} />
                        </div>
                        
                        <div className="ui small modal" style={{display : isGoogleFormOpened ? 'block' : 'none', marginTop : '-200', left: '52.5% !important'}}>
                            <div className="ui red grid segment tertiary small attached">
                                <div className="ui row"><div className="ui column">
                                    <div className="ui floating label sw-link red inverted" onClick={this.closeGoogleLanguages}>
                                        <i className="close icon sw-close-icon"></i>
                                    </div>
                                    <span className="sw-header">Select a language:</span>
                                </div></div>
                                <div className="ui row menu"> 
                                {languageList}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
       
        );
    }
});

module.exports = DeckPanel;
