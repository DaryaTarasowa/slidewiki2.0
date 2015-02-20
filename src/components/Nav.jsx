'use strict';
var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible').Mixin;
var loginActions = require('../actions/LoginActions');
var LocalStorageMixin = require('react-localstorage');

var Nav = React.createClass({
    getInitialState: function () {
        return {
            selected: 'home',
            links: {}
        };
    },
    render: function() {
        var selected = this.props.selected.name || this.state.selected.name,
            links = this.props.links || this.state.links,
            context = this.props.context,
            
            linkHTML = Object.keys(links).map(function (name) {
                var className = 'item',
                    link = links[name];
                if(link.group=='topnav'){
                  if (selected === name) {
                    className += ' active';
                  }
                  return (
                    <div className={className} key={link.path}>
                      <NavLink routeName={link.page} context={context} href={link.path}>{link.label}</NavLink>
                    </div>
                  );
                }
            });
            
        return (
         
          <nav id="main_navbar"  className="menu inverted navbar ui page ui grid">
            
                <a href="/" className="brand item">SlideWiki</a>
                {linkHTML}
                <UserMenu context={context} />
          
          </nav>
     
        );
    }
});





var UserMenu = React.createClass({
    displayName: 'UserMenu',
    mixins: [StoreMixin, LocalStorageMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
    getInitialState: function () {
        
        var state = this.getStateFromStores();
        return state;
    },
    getStateFromStores: function () { 
        
      var state = this.getStore(AuthStore).getState();
      return state;
         
    },

    _onChange: function() {
        var state = this.getStateFromStores();        
        this.setState(state);
    }, 
    
    
    render : function(){
        var self = this;
        var menu;
        if (this.state.isLoggedIn){
            menu = <Dropdown context = {this.props.context} user = {this.state.currentUser} />;
        }else{
            menu = <LoginButton context = {this.props.context} isLoggedIn = {this.state.isLoggedIn} />;
        }
        return (
            <div className="item">{menu}</div>
        )
    }
});

var Dropdown = React.createClass({
    _handleLogout : function(e){
        this.props.context.executeAction(loginActions.logOut);
    },
    render : function(){
        var self  = this;
        var style = {"zIndex" : "1000 !important"};
    return (
        <div className="ui dropdown simple inverted" style={style}>                        
            {this.props.user.username}<i className="dropdown icon"></i>
            <div className="menu ui inverted" style={style}>
                <div className = "item"><a onClick={self._handleLogout}>Logout</a></div>
            </div>
        </div>
    )}
});

var LoginButton = React.createClass({
    _handleOpenCloseForm: function(e){
        e.preventDefault();
        
        this.props.context.executeAction(loginActions.openCloseForm, {});
    },
    render : function(){
        var self = this;
        var style = {cursor : 'pointer'};
       
        var login = this.props.isLoggedIn ? null : <a style={style} onClick={self._handleOpenCloseForm} > Login </a>
        
        return (
            <div>
                {login}
            </div>
        )
    }

});

module.exports = Nav;