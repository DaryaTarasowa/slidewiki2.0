'use strict'
var React = require('react');
var debug = require('debug');
//stores
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible').Mixin;
var loginActions = require('../actions/LoginActions');
var appActions = require('../actions/AppActions');
var navigateAction = require('flux-router-component/actions/navigate');
var UserStore = require('../stores/UserStore');
var url = require('urldecode');

var FacebookLink = React.createClass({
    mixins: [StoreMixin],
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
    return {
      error: this.getStore(AuthStore).getError(),
      IsLoggedIn: this.getStore(AuthStore).getIsLoggedIn(),
      ObjectData: this.getStore(UserStore).getObject()
    };
  },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
   
    render: function() {
        var output;
        var self = this;
        var loaderClass = "ui blue submit button";
        if (this.state.isLoggingIn){
            loaderClass = "ui blue submit button loading";
        }


            output = <SignForm context={this.props.context}/>;
            if (this.state.ObjectData.flag === 'true') {output = <LoginForm context={this.props.context}/>}
            
        return (
            <div>
                <div className="html ui six wide segment">
                    <div className="ui two column middle aligned relaxed fitted centered stackable grid ">
                        <div className="center aligned column four wide">{output}</div>
                    </div>
                </div>
            </div>   
        )
    },

});

var LoginForm = React.createClass({
    
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
  getInitialState: function () {

    return this.getStateFromStores();
  },
  getStateFromStores: function () {
    return {
      error: this.getStore(AuthStore).getError(),
      IsLoggedIn: this.getStore(AuthStore).getIsLoggedIn(),
      ObjectData: this.getStore(UserStore).getObject()
    };
  },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
  _handleSubmit: function(e) {
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim();
        this.context.executeAction(loginActions.sendLogin, {username : username, password: password});

    },
    render : function(){
        if (this.state.IsLoggedIn) this.context.executeAction(navigateAction, {url: '/'});
        
        var userInputClass = "ui left icon input";
        var passInputClass = "ui left icon input";
        var loaderClass = "ui blue submit button";
        var loginHint;
        var passHint;
        var inputName = url(this.state.ObjectData.name);

        if (this.state.error){
            if (this.state.error.loginError){
                userInputClass += ' error';
                loginHint = <div className="ui pointing tiny label error">{this.state.error.message}</div>
            }
            if (this.state.error.passError){
                passInputClass += ' error';
                passHint = <div className="ui pointing tiny label error">{this.state.error.message}</div>
            }
        }
        
        var outputLogin;
        var self = this;
            outputLogin = 
                        <div className="ui form segment">
                        <p>You have a local account linked with your Facebook account</p>
                            <div className="field">
                                <label>Username</label>
                                <div className={userInputClass}>
                                    <input placeholder="Username" ref="username" defaultValue={inputName} type="text" />
                                    <i className="user icon"></i>
                                </div>
                                {loginHint}                               
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <div className={passInputClass}>
                                    <input type="password" ref="password" />
                                    <i className="lock icon"></i>
                                </div>
                                {passHint}
                            </div>
                            <div className={loaderClass} onClick={this._handleSubmit}>Login</div>
                        </div>
        return(
            <div>{outputLogin}</div>
        )
    }
});

var SignForm = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },
  getInitialState: function () {

    return this.getStateFromStores();
  },
  getStateFromStores: function () {
    return {
      error: this.getStore(AuthStore).getError(),
      IsLoggedIn: this.getStore(AuthStore).getIsLoggedIn(),
      ObjectData: this.getStore(UserStore).getObject()
    };
  },
    _onChange: function () {
        
        this.setState(this.getStateFromStores());
    },
  _handleSubmit: function(e) {
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim(); 
        var email = this.refs.email.getDOMNode().value.trim();
        var fb_id = this.state.ObjectData.fb_id;
        this.context.executeAction(loginActions.sendSignUp, {username : username, email : email, password: password, fb_id: fb_id});
        

    },
    render: function() {
        if (this.state.IsLoggedIn) this.context.executeAction(navigateAction, {url: '/'});

        var self = this;
        var loaderClass = "ui green submit button";
        if (self.state.isLoggingIn){
            loaderClass = "ui green submit button loading";
        }
        var userInputClass = "ui left icon input";
        var emailInputClass = "ui left icon input";
        var passInputClass = "ui left icon input";
        var loginHint;
        var passHint;
        var emailHint;
        var inputName = url(this.state.ObjectData.name).replace(/ /g,'').toLowerCase();
        var decodedEmail = url(this.state.ObjectData.email);

        console.log(this.state);

        if (self.state.error){
            if (self.state.error.loginError){
                userInputClass += ' error';
                loginHint = <div className="ui pointing tiny label red">{this.state.error.message}</div>;
            }    
            if (self.state.error.passError){
                passInputClass += ' error';
                passHint = <div className="ui pointing tiny label red">{this.state.error.message}</div>;
            }
            if (self.state.error.emailError){
                emailInputClass += ' error';
                emailHint = <div className="ui pointing tiny label red">{this.state.error.message}</div>
            }         
        }
        var outputSign;
            outputSign = 
                        <div className="ui form segment">
                        <p>Please sign up a local account to link with your Facebook account</p>
                        <div className="field">
                            <label>Username</label>
                            <div className={userInputClass}>
                                <input placeholder="Username" ref="username" defaultValue={inputName} type="text" />
                                <i className="user icon"></i>
                            </div>
                            {loginHint}
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <div className={emailInputClass}>
                                <input placeholder="Email" ref="email" defaultValue={decodedEmail} type="text" />
                                <i className="mail icon"></i>
                            </div>
                            {emailHint}
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <div className={passInputClass}>
                                <input type="password" ref="password" />
                                <i className="lock icon"></i>
                            </div>
                            {passHint}
                        </div>
                        <div className={loaderClass} onClick={this._handleSubmit}>SignUp</div>
                        
                        </div>;
        return(
            <div>{outputSign}</div>
        )}

});

module.exports = FacebookLink;
