'use strict'
var async = require('async');
var TreeStore = require('../stores/TreeStore');
var DeckSliderStore = require('../stores/DeckSliderStore');
var ContributorsStore = require('../stores/ContributorsStore');
var DeckStore = require('../stores/DeckStore');
var treeActions = require('../actions/TreeActions');
var showContributors = require('../actions/showContributors');
var showSliderControl = require('../actions/showSliderControl');

var DeckActions = {
    initializeDeckPage: function(context, payload, done){
        
        async.parallel([
            //load deck tree or only highlight a node when tree is already rendered
            function(callback) {
                module.exports.loadUpdateTree(context, payload, callback);
            },
            //////////////////////////////////
      //      load content for deck/slide
            function(callback){
                module.exports.loadContainer(context, payload, callback);
            },
//
            function(callback) {
                context.executeAction(module.exports.showContributors, {selector: payload.selector}, callback);
        
            },
//            ////////////////////////////////////
//            //TODO: this parallel action might be dependent on the showSlide action. we should check this later.
//            //load slides for slider
            function(callback) {
               
               context.executeAction(module.exports.loadSlides, {deck:payload.deck, selector: payload.selector}, callback);
            },
////            ////////////////////////////////////
////            //Load languages list
            function(callback) {
                module.exports.loadLanguages(context, callback);
            }
        ],
        function(err, results) {
            
            if (!err) {
                
                context.dispatch('UPDATE_PAGE_TITLE', {
                    pageTitle: 'SlideWiki -- Deck ' + payload.deck + ' > ' +
                        payload.selector.type + ' : ' + payload.selector.id + ' | ' +
                        payload.selector.mode
                });
                done();
            }
        });
    },
    updateDeckPage: function(context, payload, done) {
        async.parallel([
            //only highlight a node when tree is already rendered
            function(callback) {
               
               treeActions._updateSelector(context, payload, callback);
            },
            ////////////////////////////////////
            //load content for deck/slide
            function(callback) {                
              //first need to prepare the right container for deck/slide/etc.
                module.exports.prepareContentType(context, payload, function(res) {
                  //then run the corresponding action
                    
                    switch (payload.selector.type) {
                        case 'deck':
                            context.executeAction(module.exports.showDeck, payload, callback);
                            break;
                        case 'slide':
                            
                            context.executeAction(module.exports.showSlide, payload, callback);
                            break;
                    }
                });
            },
            ////////////////////////////////////
            //Update contributors
            function(callback) {
                var object = {selector: {type: payload.selector.type, id:payload.selector.id}};
                module.exports.showContributors(context, object, callback);
            },

            ////////////////////////////////////
            //TODO: this parallel action might be dependent on the showSlide action. we should check this later.
            //load slides for slider
            function(callback) {
           
                if (payload.selector.type === 'slide') {
                    //there is no need to load slides list
                    module.exports.updateSliderControl(context, {
                        selector: {
                            type: 'slide',
                            id: payload.selector.id,
                            mode: payload.selector.mode
                        }
                    }, callback);

                } else {
                    //hide slider control
                    module.exports.hideSliderControl(context, {}, callback);
                }
            }
          ////////////////////////////////////
        ],
        // optional callback
        function(err, results) {
            
            if (!err) {
                
                context.dispatch('UPDATE_PAGE_TITLE', {
                    pageTitle: 'SlideWiki -- Deck ' + payload.deck + ' > ' +
                        payload.selector.type + ' : ' + payload.selector.id + ' | ' +
                        payload.selector.mode
                });
                done();
            }
        });
    },

    loadUpdateTree: function(context, payload, done){

        if (context.getStore(TreeStore).isAlreadyComplete(payload.deck)) {
            //only highlight node

            context.executeAction(module.exports.updateTreeNodeSelector, {
                deck: payload.deck,
                selector: payload.selector
            }, done);
        } else {
            //load the whole tree
            context.executeAction(module.exports.showDeckTree, {
                deck: payload.deck,
                selector: payload.selector
            }, done);
        }
    },
    
    updateTreeNodeSelector: function(context, payload, done){  
        context.dispatch('UPDATE_TREE_NODE_SELECTOR', {
            selector: payload.selector
        });
        
        done();
    },
    
    showDeckTree: function(context, payload, done){
        context.dispatch('SHOW_DECK_TREE_START', payload);
        
        context.service.read('deck.tree', payload, {}, function(err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_TREE_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_DECK_TREE_SUCCESS', {
                nodes: res.nodes,
                selector: payload.selector
            });
            //null indicates no error
            done(null);
        });
    },
    
    loadContainer: function(context, payload, done){
        //first need to prepare the right container for deck/slide/etc.
        context.executeAction(module.exports.prepareContentType, {
            selector: payload.selector
        }, function(res) {
          //then run the corresponding action
            switch (payload.selector.type) {
                case 'deck':
                    context.executeAction(module.exports.showDeck, {
                        selector: payload.selector
                    }, done);
                    break;
                case 'slide':
                    context.executeAction(module.exports.showSlide, {
                        selector: payload.selector
                    }, done);
                    break;
            }
        });
    },
    
    prepareContentType: function (context, payload, done) {
        context.dispatch('PREPARE_CONTENT_TYPE', payload);
        done(null);
    },
    
    showDeck: function (context, payload, done) {
        context.dispatch('SHOW_DECK_START', payload);
        var object = {selector: {type: payload.selector.type, id:payload.selector.id, mode: payload.selector.mode}};
        context.service.read('deck.content', object, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_DECK_SUCCESS', res);
                done(null);
        });
    },
    
    showSlide: function (context, payload, done) {
        context.dispatch('SHOW_SLIDE_START', payload);
        var object = {selector: {type: payload.selector.type, id:payload.selector.id, mode: payload.selector.mode}};
        context.service.read('deck.content', object, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_SLIDE_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_SLIDE_SUCCESS', res);
                done(null);
        });
    },
    
    showContributors: function (context, payload, done) {
        context.dispatch('SHOW_CONTRIBUTORS_START', payload);
        context.service.read('deck.contributors', payload, {}, function (err, res) {
            if (err) {
                context.dispatch('SHOW_CONTRIBUTORS_FAILURE', err);
                done();
                return;
            }
            context.dispatch('SHOW_CONTRIBUTORS_SUCCESS', res);
            done(null);
        });
    },
    forceLoadSlides : function(context, payload, done){
        console.log('force');
        if (payload.selector.type === 'slide') {
            //reload slides list
            context.executeAction(module.exports.showSliderControl, {
                  deck: payload.deck,
                  selector: {
                      type: 'slide',
                      id: payload.selector.id,
                      mode: payload.selector.mode
                  }
            }, done);
            
        } else {
            //hide slider control
            context.executeAction(module.exports.hideSliderControl, {}, done);
        }
    },
    loadSlides : function(context, payload, done){  
        
        if (payload.selector.type === 'slide') {
            //show slider control
            if (context.getStore(DeckSliderStore).isAlreadyComplete()) {
              
              //there is no need to load slides list
                context.executeAction(module.exports.updateSliderControl, {
                    selector: {
                        type: 'slide',
                        id: payload.selector.id,
                        mode: payload.selector.mode
                    }
                }, done);
            } else {
              
              //reload slides list
              context.executeAction(module.exports.showSliderControl, {
                    deck: payload.deck,
                    selector: {
                        type: 'slide',
                        id: payload.selector.id,
                        mode: payload.selector.mode
                    }
              }, done);
            }
        } else {
                //hide slider control
                context.executeAction(module.exports.hideSliderControl, {}, done);
        }
    },
    
    updateSliderControl: function(context, payload, done) {
        context.dispatch('UPDATE_SLIDER_CONTROL', {
            currentSlideID: payload.selector.id
        });
        done(null);
    },
    
    showSliderControl: function(context, payload, done) {
        
        context.service.read('deck.slidelist', payload, {}, function(err, res) {

            if (err) {
                
                context.dispatch('SHOW_SLIDER_CONTROL_FAILURE', err);
                done();
                return;
            }
           
            context.dispatch('SHOW_SLIDER_CONTROL_SUCCESS', res);
            done();
        });

    },
    playDeck: function(context, payload, done) {
        
        
        context.service.read('deck.slidesForPlay', payload, {}, function(err, res) {
            if (err) {
                context.dispatch('PLAY_DECK_FAILURE', err);
                done();
                return;
            }
            context.dispatch('PLAY_DECK_SUCCESS', res);
            context.dispatch('SET_THEME', payload.theme);
            done();
        });
        

    },
    
    hideSliderControl: function (context, payload, done) {
        context.dispatch('HIDE_SLIDER_CONTROL');
        done(null);
    },
    
    updateTitle: function(context, payload, done){
        
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: 'SlideWiki -- Deck ' + payload.deck + ' > ' +
                payload.selector.type + ' : ' + payload.selector.id + ' | ' +
                payload.selector.mode
        });
        done();
    },
    
    loadLanguages: function(context, done){         
        context.service.read('deck.google_languages', {}, {}, function(err, res) {
          if (err) {
            context.dispatch('GOOGLE_LANGUAGES_FAILURE', err);
            done();
            return;
          }
          context.dispatch('GOOGLE_LANGUAGES_SUCCESS', {
            languages: res.languages
          });
          //null indicates no error
          
          done(null);
        });       
    },
    
    translateTo : function(context, payload, done){
        context.dispatch('TRANSLATE_TO', payload);
        
        //var payload = {deck : }
//        context.executeAction(initializeDeckPage, {
//                    deck: payload.params.id,
//                    selector: selector,
//                    mode: mode
//                }, done);
    },
    
    setRedirectFalse: function(context){
        context.dispatch('REDIRECT_COMPLETED');
    },
    

            
};

module.exports = DeckActions;


