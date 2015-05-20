var React = require('react');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
var ContentStore = require('../stores/ContentStore');
var DeckStore = require('../stores/DeckStore');
var ApplicationStore = require('../stores/ApplicationStore');
var deckActions = require('../actions/DeckActions');

var TranslationButton = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: {
            _onChange: [ApplicationStore, DeckStore]
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
        return {
            languagesAvailable: this.getStore(DeckStore).getLanguagesAvailable(),
            googleLanguages: this.getStore(ApplicationStore).getGoogleLanguages(),
            languageOpen: false,
            googleFormOpened : false,
            redirect: this.getStore(DeckStore).getRedirect(),
        };
    },
    _onChange: function() {

        this.setState(this.getStateFromStores());
    },
    closeGoogleLanguages : function(){
        this.setState({googleFormOpened: false});
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
    
    translateTo : function(language_code){
        var payload = {id : this.props.content.id, language: language_code};
        this.props.context.executeAction(deckActions.translateTo, payload);
    },
    shouldComponentUpdate : function(nextProps, nextState){ //after the translation we need to redirect to the new deck
        if (nextProps.content.id !==this.props.content.id && nextState.redirect){
           this.props.context.executeAction(navigateAction, {type: 'click', url: '/deck/'+nextProps.content.id});
           this.props.context.executeAction(deckActions.setRedirectFalse);
                return true;
        }else{
            return true;
        }
    },
    render: function(){
        var self = this;
        var languageList;
        
        if (this.state.googleLanguages.length){
            languageList = this.state.googleLanguages.map(function(node, index){
            return (
                    <div key={node.language} className="ui fitted labeled three wide column sw-menu-link" style={{display: "inline-block !important", padding:"0 10px !important"}}>
                        <a onClick={self.translateTo.bind(self, node.language)}>{node.name}</a>
                    </div> 
                )
            });
        }; 
        var languagesAvailableList;
        languagesAvailableList = this.state.languagesAvailable.map(function(node, index){
            return (
                       <a className="item fitted vertically" href={"/deck/" + node.id}>{node.language.name}</a>
                   )
        })
        return (
            <div>
                <div className="ui dropdown right basic icon right labeled button top right attached label">
                    {this.props.content.language}
                    <i className="world icon blue" ref="world_icon" onClick={this.openCloseLanguages}></i>
                    <div className="menu vertical ui small fluid" ref="menu" style={{display: this.state.languageOpen ? 'block' : 'none'}}>
                         
                        {languagesAvailableList}
                        <div className="divider"></div>
                        <div className="ui item" onClick={this.openGoogleLanguagesTab}>
                           
                            <span className="text">TRANSLATE</span> 
                        </div>
                    </div>
                </div>
                 <div className="ui small modal" style={{display : this.state.googleFormOpened ? 'block' : 'none', top : '100', left: '52.5% !important', position:'fixed'}}>
                    <div className="ui red grid segment tertiary small attached stackable">
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
                
        )
    }
    
})

module.exports = TranslationButton