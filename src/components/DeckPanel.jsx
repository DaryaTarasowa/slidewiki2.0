'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
//stores
var DeckStore = require('../stores/DeckStore');
var ApplicationStore = require('../stores/ApplicationStore'); //for loading languages list
//SlideWiki components
var DeckView=require('./DeckView.jsx');

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
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    openCloseLanguages: function(e){
        var state = this.state.languageOpen;
        var current = this.refs.world_icon.getDOMNode();
        if (state){
            current.className += ' yellow inverted';
        }else{
            var re = / yellow inverted/gi;
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
    render: function() {
        var isGoogleFormOpened = this.state.googleFormOpened;
        var languageList = this.state.googleLanguages.map(function(node, index){
            return (
                    <div key={node.language} className="ui fitted labeled three wide column sw-menu-link">
                        {node.name}
                    </div> 
                )
        })
        return (
                <div className="sw-deck-panel">
                    <div className="panel" >
                        <div className="ui secondary top yellow attached segment grid">
                            <div className="nine wide column left floated left aligned">
                                <div>{this.state.content.title}</div>
                            </div>
                            <div className="five wide column right floated right aligned">
                                <div className="ui floating dropdown button right labeled compact icon tiny yellow fluid">
                                    <span className="text">{this.state.content.language}</span>
                                    <i className="world icon yellow inverted" ref="world_icon" onClick={this.openCloseLanguages}></i>
                                    
                                    <div className="menu ui small " ref="menu" style={{display: this.state.languageOpen ? 'block' : 'none'}}>
                                        <div className="ui small basic button right labeled compact icon fluid">
                                            <i className="world icon"></i>
                                            <span className="text">Arabic</span>                                            
                                        </div>
                                        <div className="ui small basic button right labeled compact icon fluid">
                                            <i className="world icon"></i>
                                            <span className="text">Chinese</span>                                            
                                        </div>
                                        <div className="ui small basic button right labeled compact icon fluid">
                                            <i className="world icon"></i>
                                            <span className="text">Danish</span>                                            
                                        </div>
                                        <div className="divider"></div>
                                        <div className="item centered header ui grid yellow mini" onClick={this.openGoogleLanguagesTab}><span>Translate</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    <div className="ui top attached segment" >
                        <DeckView id={this.props.id} content={this.state.content} context={this.props.context} />
                    </div>

                </div>
       
        );
    }
});

module.exports = DeckPanel;
