'use strict';
var api = require('../configs/config').api;
var agent = require('superagent');
var debug = require('debug');
var createStore = require('fluxible/utils/createStore');

//error messages: 
var internal =  {loginError : true, passError : true, message : 'An internal error occured, please try one more time'};
var wrong_user =  {loginError : true, passError : false, message : 'The username is already taken, please pick another one'};
var wrong_pass =  {loginError : false, passError : true, message : 'The username is correct, but the password does not match'};
var no_user =  {loginError : true, passError : false, message : 'The username is not correct or you are not registered yet'};
var empty_user =  {loginError : true, passError : false, message : 'The username is required'};
var empty_pass =  {loginError : false, passError : true, message : 'Password is required'};
var empty_email =  {loginError : false, passError : false, emailError: true, message : 'Email is required'};

var AuthStore = createStore({
    storeName: 'AuthStore',
    handlers: {
        'SEND_LOGIN': 'onSendLogin',
        'SEND_FACEBOOK': 'onSendFacebook',
        'SEND_SIGNUP' : 'onSendSignUp',
        'OPEN_CLOSE_FORM': 'onFormOpenClose',
        'LOGOUT': '_setLoggedOut',
        'SHOW_SIGN_FORM': 'onShowSignForm',
        'SHOW_LOGIN_FORM': 'onShowLoginForm'
    },
    
    initialize: function () {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isLoggingIn = false; 
        this.isFormOpened = false;
        this.openForm = false;
        this.error = null;
        this.showSignForm = false;
        this.showLoginForm = true;
    },
    onFormOpenClose: function(payload){
        this.isFormOpened = true;
        this.emitChange();
    },
    getIsLoginFormOpened: function(){
        return this.isFormOpened;
    },
    onShowSignForm : function(){
        this.showSignForm = true;
        this.showLoginForm = false;
        this.error = null;
        this.emitChange();
    },
    onShowLoginForm : function(){
        this.showLoginForm = true;
        this.showSignForm = false;
        this.error = null;
        this.emitChange();
    },
    onSendLogin: function(payload) {
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        if (!payload.username){
            this.error = empty_user;
        }
        if (!payload.password){
            this.error = empty_pass;
        }
        this.emitChange();
        if (payload.username && payload.password){
            agent
                .post(api.path + '/login')
                .type('form')
                .send({ username: payload.username, password: payload.password })
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                        if (res.body.error){
                            switch (res.body.error[0]) {
                                case 'INTERNAL' :
                                    self.error = internal;
                                    self.isLoggingIn = false;
                                    return self.emitChange();
                                    break;
                                case 'NO_USER' :
                                    self.error = no_user;
                                    self.isLoggingIn = false;
                                    return self.emitChange();
                                    break;
                                case 'WRONG_PASS' :
                                    self.error = wrong_pass;
                                    self.isLoggingIn = false;
                                    return self.emitChange();
                                    break;
                                default:
                                    return self._setLoggedIn(res.body);
                            }
                        }else{
                            return self._setLoggedIn(res.body);
                        }
                        
                    }
            });
        }
        
    },
    onSendSignUp :  function(payload) { 
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        //console.log(payload);
        if (!payload.username.length){
            this.error = empty_user;
            this.isLoggingIn = false;
        }
        if (!payload.password.length){
            this.error = empty_pass;
            this.isLoggingIn = false;
        }
        if (!payload.email.length){
            this.error = empty_email;
            this.isLoggingIn = false;
        }  
        this.emitChange();
        if (payload.username.length && payload.password.length && payload.email.length){
            agent
            .post(api.path + '/signup')
            .type('form')
            .send({ username: payload.username, password: payload.password, email: payload.email })
            .end(function(err, res){
                if (err){
                    self.error = internal;
                    return self.emitChange();
                }else{
                    switch (res.body.error[0]) {
                        case 'INTERNAL' :
                            self.error = internal;
                            self.isLoggingIn = false;
                            return self.emitChange();
                            break;
                        case 'WRONG_USERNAME' :
                            self.error = wrong_user;
                            self.isLoggingIn = false;
                            return self.emitChange();
                            break;
                        default: 
                            return self._setLoggedIn(res.body);
                    }
                }
            });
        }
        
    },
    onSendFacebook: function(payload) {
        this.isLoggingIn = true;
        this.emitChange();
        var self = this;
        agent
            .get(api.path + '/auth/facebook')
    
            .end(function(err, res){
                //console.log(err);
                if (err){
                    //console.log(err);
                }
                
//                if (res.body.id){
//                    console.log('res.id');
//                    console.log(res.body);
//                    self._setLoggedIn(res.body);
//                    self.emitChange();
//                }else{
//                    console.log('no res id');
//                    console.log(res.body);
//                }
            });
    },
    getState: function() {
        
        return {
            currentUser: this.currentUser,
            isLoggedIn: this.isLoggedIn,
            isLoggingIn: this.isLoggingIn,
            isFormOpened: this.isFormOpened,
            showSignForm : this.showSignForm,
            showLoginForm : this.showLoginForm,
            error: this.error
        };
        
    },
    getIsLoggingIn : function(){
        return this.isLoggingIn;
    },
    getIsLoggedIn : function(){
        return this.isLoggedIn;
    },
    getCurrentUser : function(){
        return this.currentUser;
    },
    _setLoggedOut: function() {
        //localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.isLoggingIn = false;
        this.isLoggedIn = false;
        this.isFormOpened = false;
        this.showSignForm = false;
        this.showLoginForm = true;
        this.error = false;
        return this.emitChange();
    },
    _setLoggedIn: function(user) {
        //localStorage.setItem('currentUser', user);
        this.isLoggingIn = false;
        this.isLoggedIn = true;
        this.currentUser = user;
        this.isFormOpened = false;
        this.showSignForm = false;
        this.showLoginForm = true;
        this.error = false;
        return this.emitChange();
        
    }, 
    dehydrate: function () {
        return this.getState();
    },
    rehydrate: function (state) {
        this.currentUser = state.currentUser;
        this.isLoggedIn = state.isLoggedIn;
        this.isLoggingIn = state.isLoggingIn; 
        this.isFormOpened = state.isFormOpened;
        this.showSignForm = state.showSignForm;
        this.showLoginForm = state.showLoginForm;
        this.error = state.error;
    }
});

module.exports = AuthStore;


