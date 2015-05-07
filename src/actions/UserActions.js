'use strict'
var async = require('async');
var UserStore = require('../stores/UserStore');


var UserActions = {
    
    showUser: function (context, payload, done) {
            context.service.read('deck.users', payload, {}, function (err, res) {
                if (err) {
                    context.dispatch('SHOW_USERS_FAILURE', err);
                    done();
                    return;
                }
                context.dispatch('SHOW_USERS_SUCCESS', res);
                context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: 'SlideWiki | User ' + res.username});

                done(null);
            });
                
    },

    retrieveFBUser: function (context, payload, done) {

                context.dispatch('SHOW_USERS_SUCCESS', payload);
                context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: 'SlideWiki | Facebook Link'});

                done(null);
                
    }
    

            
};

module.exports = UserActions;


