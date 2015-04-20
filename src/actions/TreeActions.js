'use strict'
var async = require('async');
var TreeStore = require('../stores/TreeStore');
var deckActions = require('../actions/DeckActions');

exports.addEmptySlide = function(context, payload, done){
    
            var short_payload = {
                deck: payload.deck, 
                new_slide: payload.new_slide,
                
                selector: {
                    type: payload.selector.type, 
                    id: payload.selector.id, 
                    mode: payload.selector.mode
                }
                
            };
           
            context.service.read('deck.addSlide', short_payload, {}, function(err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_TREE_FAILURE', err);
                done();
                return;
            }
            context.dispatch('ADD_EMPTY_SLIDE', {
                slides: res.slides,
                selector: payload.selector,
                new_slide: res.new_slide,
                parent: payload.parent,
                deckID: payload.deck
            });
            //null indicates no error
            done(null);
        });
    
};

exports.deleteFrom = function(context, payload, done){
    
            var short_payload = {
                id: payload.id, 
                type: payload.type,
                parent_id: payload.parent.id,
                deck: payload.deck
                
            };
           
            context.service.read('deck.deleteSlide', short_payload, {}, function(err, res) {
            if (err) {
                context.dispatch('SHOW_DECK_TREE_FAILURE', err);
                done();
                return;
            }
            payload.slides = res.slides;
            context.dispatch('DELETE_FROM', payload);
            //null indicates no error
            done(null);
        });
    
};

exports._onDragStart = function(context, payload, done){
    context.dispatch('ON_DRAG_START', payload);
    done();
};

exports.checkDropPossible = function(context, payload, done){
    context.dispatch('CHECK_DROP_POSSIBLE', payload);
    //context.dispatch('MOVE_ITEM', payload);
    done();
};

exports._onDrop = function(context, payload, done){
    context.dispatch('ON_DROP', payload);
    done();
};
exports._updateSelector = function(context, payload, done){
    context.dispatch('ENRICH_TREE_NODE_SELECTOR', payload);
    done();
};
exports._onDragEnd = function(context){
    context.dispatch('ON_DRAG_END');
};
exports.setNewTitle = function(context, payload, done){
    context.dispatch('SET_NEW_TITLE', payload);
    done();
};





