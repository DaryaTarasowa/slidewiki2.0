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
        edit: false
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
    switchToEdit: function(){
        this.setState({edit: true});
    }, 
  render: function(){
      var self = this;
      var description = this.state.content.description || 'Provide description...';
      var origin = this.state.content.origin;
      
      var date = new Date(this.state.content.created_at);
        var created_at;
        if (date){
            try{created_at = dateFormat(date, 'dd mmm yyyy');}
            catch(err){created_at = null;}
        }
        
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
                        <div className="ui attached segment" >
                            <div className="floating ui red label" style={{display: this.state.edit ? 'none' : 'inherit'}} onClick={this.switchToEdit}>Edit</div>
                            <div className="floating ui red label" style={{display: this.state.edit ? 'inherit' : 'none'}}  onClick={this.save}>Save</div>
                            <div contentEditable = {this.state.edit} dangerouslySetInnerHTML={{__html: this.state.content.description}} />
                                <div className="ui divider">

                                </div>
                                <ul className="ui list">
                                    <li>
                                        Created at
                                        <div contentEditable = {this.state.edit}>{created_at}</div>
                                    </li>
                                    <li>
                                        Default style theme
                                        <div contentEditable = {this.state.edit}></div>
                                    </li>
                                    <li>
                                        Number of slides
                                       <div contentEditable = {this.state.edit}>{this.state.content.numberOfSlides}</div>
                                    </li>
                                    <li>
                                        Origin
                                        <div contentEditable = {this.state.edit}>{this.state.content.origin}</div>
                                    </li>
                                </ul>
                        </div>
                        
                        
                    </div>
                </div>
            
       
     
              
              
              
              
              )
  }
});

module.exports = DeckEditor;


