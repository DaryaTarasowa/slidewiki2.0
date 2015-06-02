
'use strict';

var debug = require('debug');


module.exports = {

    'sendLogin' : function (context, payload, done) {
        debug('send_login');
        
        context.dispatch('SEND_LOGIN', payload);
        done();
    },
    'sendSignUp' : function (context, payload, done) {
        debug('send_signUp');
        context.dispatch('SEND_SIGNUP', payload);
        done();
    },
    'sendFacebook' : function (context, payload, done) {
        debug('send_login');
        
        context.dispatch('SEND_FACEBOOK', payload);
        done();
    },
    'openCloseForm' : function (context, payload, done) {
        debug('Iam in actions!');
        context.dispatch('OPEN_CLOSE_FORM', payload);
        done();
    },
    'logOut' : function(context){
        context.dispatch('LOGOUT');
    },
    'showSignForm' : function(context){
        context.dispatch('SHOW_SIGN_FORM');
    },
    'showLoginForm' : function(context){
        context.dispatch('SHOW_LOGIN_FORM');
    }

};