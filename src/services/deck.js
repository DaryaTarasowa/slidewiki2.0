'use strict';
var http = require('http');
var httpOptions = {
  host: 'localhost',
  port: 8080,
  path: '/api'
};

var randomResponseTime = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  name: 'deck',
  read: function(req, resource, params, config, callback) {
        switch(resource){
            case 'deck.google_languages' :
                httpOptions.path = "/api/languages";
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                      // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        callback(parsed.error, {languages: parsed});
                    });
                });
                break;
            case 'deck.users' :
                var user_id = params.id;
                httpOptions.path = "/api/user/" + user_id;
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                      // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        callback(parsed.error, parsed);
                    });
                });
                break;
            case 'deck.tree' : 
                var deck_id = params.deck;
                httpOptions.path = "/api/deck/tree/" + deck_id;
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                      // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        callback(parsed.error, {nodes: parsed});
                    });
                });
                break;
            case 'deck.contributors' :
                if (typeof(params.selector) === 'object') {
                    var selector = params.selector;
                } else {
                    var selector = JSON.parse(params.selector);
                }
                httpOptions.path = "/api/content/contributors/" + selector.type + "/" +
                selector.id;
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                         body += d;
                    });
                    response.on('end', function() {
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        callback(parsed.error, {contributors: parsed});
                    });
                }); 
                break;
            case 'deck.slidesForPlay' :
                var deck_id = params.deck;
                
                httpOptions.path = "/api/deck/slides/" + deck_id + "/offset/1/limit/0/false";
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                         body += d;
                    });
                    response.on('end', function() {
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        if (parsed.error){
                            callback(parsed.error, null);
                        }else{
                            var res = {
                                deckID: deck_id,
                                slides: parsed.slides
                            };
                          callback(null, res);
                        }
                      
                    });
                });
                break;
            case 'deck.slidelist' :
                
                var deck_id = params.deck;
                //handle Ajax requests return object
                if (typeof(params.selector) === 'object') {
                    var selector = params.selector;
                } else {
                     var selector = JSON.parse(params.selector);
                }
                
                httpOptions.path = "/api/deck/slides/" + deck_id + "/offset/1/limit/0/true";
                http.get(httpOptions, function(response) {
                  // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                         body += d;
                    });
                    response.on('end', function() {
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);
                        if (parsed.error){
                            callback(parsed.error, null);
                        }else{
                            var res = {
                                deckID: deck_id,
                                currentSlideID: selector.id,
                                slides: parsed.slides
                            };
                          callback(null, res);
                        }

                    });
                });
                break;
            case 'deck.content' :
               
                if (typeof(params.selector) === 'object') {
                    var selector = params.selector;
                } else {
                    var selector = JSON.parse(params.selector);
                }
                //separate handler for slides & decks
                switch (selector.type) {
                    case 'deck':
                        httpOptions.path = "/api/deck/" + selector.id;
                        http.get(httpOptions, function(response) {
                          // Continuously update stream with data
                            var body = '';
                            response.on('data', function(d) {
                                 body += d;
                            });
                            response.on('end', function() {
                                // Data reception is done, do whatever with it!
                                var parsed = JSON.parse(body);
                                if (parsed.error){
                                    callback(parsed.error, null);
                                }else{
                                    var res = {
                                        id: selector.id,
                                        type: selector.type,
                                        content: parsed
                                    };
                                    callback(null, res);
                                }
                            });
                      });
                      break;
                case 'slide':
                    httpOptions.path = "/api/slide/" + selector.id;
                    http.get(httpOptions, function(response) {
                      // Continuously update stream with data
                        var body = '';
                        response.on('data', function(d) {
                            body += d;
                        });
                        response.on('end', function() {
                            // Data reception is done, do whatever with it!
                            var parsed = JSON.parse(body);
                            if (parsed.error){
                                callback(parsed.error, null);
                            }else{
                                var res = {
                                    id: selector.id,
                                    type: selector.type,
                                    content: parsed
                                }
                            callback(null, res);
                            }

                        });
                    });
                    break;
                };
                break;
        }
    },
          /////////////////////////////////////////////
      
      
    create: function(req, resource, params, body, config, callback) {

    },
    update: function(req, resource, params, body, config, callback) {

    },
    delete: function(req, resource, params, config, callback) {

    }
};
