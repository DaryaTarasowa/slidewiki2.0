'use strict';
var async = require('async');
var showDeckTree = require('../actions/showDeckTree');
var showContributors = require('../actions/showContributors');
var prepareContentType = require('../actions/prepareContentType');
var showDeck = require('../actions/showDeck');
var showSlide = require('../actions/showSlide');
var hideSliderControl = require('../actions/hideSliderControl');
var updateTreeNodeSelector = require('../actions/updateTreeNodeSelector');
var updateSliderControl = require('../actions/updateSliderControl');
var showSliderControl = require('../actions/showSliderControl');
//use TreeStore to prevent requesting for deck tree on every request if it is already loaded
var TreeStore = require('../stores/TreeStore');
//use DeckSliderStore to check if we need to initialize it or not
var DeckSliderStore = require('../stores/DeckSliderStore');
var ApplicationStore = require('../stores/ApplicationStore');
var deckActions = require('../actions/DeckActions');

//payload ={deck:? , selector: {type:? , id: ?}}
module.exports = function(context, payload, done) {
  async.parallel([
      //load deck tree or only highlight a node when tree is already rendered
      function(callback) {
        if (context.getStore(TreeStore).isAlreadyComplete(payload.deck)) {
          //only highlight node
          context.executeAction(updateTreeNodeSelector, {
            deck: payload.deck,
            selector: payload.selector
          }, callback);
        } else {
          //load the whole tree
         
          context.executeAction(showDeckTree, {
            deck: payload.deck,
            selector: payload.selector
          }, callback);
        }

      },
      //////////////////////////////////
//      load content for deck/slide
      function(callback) {
        //first need to prepare the right container for deck/slide/etc.
        
        context.executeAction(prepareContentType, {
          selector: payload.selector
        }, function(res) {
            
          //then run the corresponding action
          switch (payload.selector.type) {
            case 'deck':
              context.executeAction(showDeck, {
                selector: payload.selector
              }, callback);
              break;
            case 'slide':
                console.log('slide container');
              context.executeAction(showSlide, {
                selector: payload.selector
              }, callback);
              break;
          }
        });
      },
      //////////////////////////////////
//      Update contributors
      function(callback) {
        
          
        
            context.executeAction(showContributors, {
              selector: payload.selector
            }, callback);
        
    },
      
      ////////////////////////////////////
      //TODO: this parallel action might be dependent on the showSlide action. we should check this later.
      //load slides for slider
      function(callback) {
        if (payload.selector.type === 'slide') {
          //show slider control
         
          if (context.getStore(DeckSliderStore).isAlreadyComplete()) {
            //there is no need to load slides list
           
            context.executeAction(updateSliderControl, {
              selector: {
                type: 'slide',
                id: payload.selector.id,
                mode: payload.selector.mode
              }
            }, callback);
          } else {
            //reload slides list
      
            context.executeAction(showSliderControl, {
              deck: payload.deck,
              selector: {
                type: 'slide',
                id: payload.selector.id,
                mode: payload.selector.mode
              }
            }, callback);
          }
        } else {
          //hide slider control
          context.executeAction(hideSliderControl, {}, callback);
        }

      }
      ////////////////////////////////////
    ],
    // optional callback
    function(err, results) {
        if (err){
            console.log(err);
        }
      else{
        context.executeAction(deckActions.loadLanguages, function(){
           console.log('loading languages');
            //console.log(context.getStore(ApplicationStore).getGoogleLanguages());
             done();
        });
       
      }
    });
};
