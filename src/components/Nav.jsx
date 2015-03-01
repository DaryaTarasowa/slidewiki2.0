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
            links: {},
            navOpen: false
        };
    },
    openCloseNav: function(){        
        this.setState({navOpen : !this.state.navOpen});
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
                            <div className={className}>
                                <div key={link.path}>
                                    <NavLink routeName={link.page} context={context} href={link.path}>{link.label}</NavLink>
                                </div>
                            </div>
                  );
                }
            });
            
        return (
            <div>
                <div id="main_navbar"  className="menu inverted navbar ui grid page computer only tablet only">

                    <a href="/" className="brand item">SlideWiki</a>
                   {linkHTML}
                    <UserMenu context={context} />

                </div>

                
                <nav id="main_navbar"  className="menu ui grid page mobile only inverted">
                        <a href="/" className="brand item">SlideWiki</a>
                  
                        <div className="ui dropdown floating icon tiny item inverted" onClick={this.openCloseNav}>
                            <i className="content icon" ref="menu_icon"></i>
                            <div className="menu vertical ui small inverted" ref="menu" style={{display: this.state.navOpen ? 'block' : 'none'}}>
                                 {linkHTML}
                            </div>
                        </div>
                  
                    <UserMenu context={context} />
                </nav>
                   
            </div>
        );
    }
});

var UserMenu = React.createClass({
    displayName: 'UserMenu',
   // mixins: [StoreMixin, LocalStorageMixin],
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
    getInitialState: function () {        
        return (this.getStateFromStores());
    },
    getStateFromStores: function () { 
        
      var state = this.getStore(AuthStore).getState();
      return state;
         
    },

    _onChange: function() { 
        this.setState(this.getStateFromStores());
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
           
        <div className="ui dropdown simple inverted " style={style}>                        
            {this.props.user.username}<i className="dropdown icon"></i>
            <div className="menu vertical ui small inverted" style={style}>
                <div className = "item" onClick={self._handleLogout}><div><a>Logout</a></div></div>
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
       
        var login = this.props.isLoggedIn ? null : <a  style={style} onClick={self._handleOpenCloseForm} > Login </a>
        
        return (
            <div>
                {login}
            </div>
        )
    }

});





module.exports = Nav;