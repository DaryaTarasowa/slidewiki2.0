'use strict';
var React = require('react');
var Nav = require('./Nav.jsx');
var Footer = require('./Footer.jsx');
var HomePage = require('./HomePage.jsx');
var AboutPage = require('./AboutPage.jsx');
var DeckPage = require('./DeckPage.jsx');
var LoginFormContainer = require('./LoginFormContainer.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var AuthStore = require('../stores/AuthStore');
var RouterMixin = require('flux-router-component').RouterMixin;
var StoreMixin = require('fluxible').Mixin;
var PlayPage = require('./PlayPage.jsx');
var UserPage = require('./UserPage.jsx');


var Application = React.createClass({
    mixins: [RouterMixin, StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [ApplicationStore, AuthStore]
      }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    getStateFromStores: function () {
        var appState = this.getStore(ApplicationStore).getState();
        appState.isLoginFormOpened = this.getStore(AuthStore).getIsLoginFormOpened();
        return appState;
    },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
    componentDidMount : function(){
        var user = document.cookie.username;
        console.log(user);
        console.log(document.cookie);

    },
    render: function () {
      var output='';
      var loginDiv;

      
      //choose the right page based on the route
      switch(this.state.route.name){
        case 'home':
          output=   <div>
                        <div><Nav selected={this.state.route} links={this.state.routes} context={this.props.context} /></div>
                        <LoginFormContainer context={this.props.context}/>
                        <HomePage/>
                        <Footer />
                    </div>
          break;
        case 'about': 
          output=   <div>
                        <div><Nav selected={this.state.route} links={this.state.routes} context={this.props.context} /></div>
                        <LoginFormContainer context={this.props.context}/>
                        <AboutPage/>
                        <Footer />
                    </div>
          
          break;
        case 'user': 
          output=   <div>
                        <div><Nav selected={this.state.route} links={this.state.routes} context={this.props.context} /></div>
                        <LoginFormContainer context={this.props.context}/>
                        <UserPage/>
                        <Footer />
                    </div>
          
          break;
        case 'deck':
          output=   <div>
                        <div><Nav selected={this.state.route} links={this.state.routes} context={this.props.context} /></div>
                        <LoginFormContainer context={this.props.context}/>
                        <DeckPage context={this.props.context} deckParams={this.state.route.params} />
                        <Footer />
                    </div>
                  
                        
          break;
        case 'play' :
          output=   <PlayPage context={this.props.context} deckParams={this.state.route.params}/>
          break;
      };
            
        
      //render content
        return (
                
                <div>{output}</div>
            
        );
    },
    componentDidUpdate: function(prevProps, prevState) {
      var newState = this.state;
      if (newState.pageTitle === prevState.pageTitle) {
        return;
      }
      document.title = newState.pageTitle;
    }
});

module.exports = Application;
