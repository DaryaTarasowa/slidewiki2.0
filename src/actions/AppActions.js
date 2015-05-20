'use strict'
var async = require('async');
var ApplicationStore = require('../stores/ApplicationStore');

module.exports = {
    loadLanguages: function(context){         
        context.service.read('deck.google_languages', {}, {}, function(err, res) {
            if (err) {
                context.dispatch('GOOGLE_LANGUAGES_FAILURE', err);
                return;
            }  
            console.error('!!!languages!!!');
            context.dispatch('GOOGLE_LANGUAGES_SUCCESS', {
                languages: res.languages
            });

        });       
    },

    changeRoute: function(context, payload, done){         
          context.dispatch('CHANGE_ROUTE_SUCCESS', payload.route);
          
    }

};


