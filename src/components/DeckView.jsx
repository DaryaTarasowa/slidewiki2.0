'use strict';
var React = require('react');
var DeckStore = require('../stores/DeckStore');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//SlideWiki components
var dateFormat = require('../assets/js/dateformat');
var ContentMenu = require('./ContentMenu.jsx');
var TranslationButton = require('./TranslationButton.jsx');

var DeckView = React.createClass({
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
    render: function() {
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
                        <div className="ui attached segment">
                            <div dangerouslySetInnerHTML={{__html: this.state.content.description}} />
                                <div className="ui divider">

                                </div>
                                <ul className="ui list">

                                    <li>
                                        Created at
                                        {created_at}
                                    </li>
                                    <li>
                                        Default style theme

                                    </li>
                                    <li>
                                        Number of slides
                                       {this.state.content.numberOfSlides}
                                    </li>
                                    <li>
                                        Origin
                                        {this.state.content.origin}
                                    </li>
                                </ul>
                        </div>
                        
                        
                    </div>
                </div>
       
          
        );
    }
});

module.exports = DeckView;
