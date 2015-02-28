'use strict'
var async = require('async');
var TreeStore = require('../stores/TreeStore');
var deckActions = require('../actions/DeckActions');

exports.deleteFrom = function(context, payload, done){
    context.dispatch('DELETE_FROM', payload);
    
    //context.executeAction(deckActions.loadSlides, {deck:payload.deck, selector: payload.selector});
    done();
};

exports.addEmptySlide = function(context, payload, done){
    context.dispatch('ADD_EMPTY_SLIDE', payload); 
//    if (payload.selector.type === 'slide') {
//            //reload slides list
//            console.log('slide');
//            context.executeAction(deckActions.showSliderControl, {
//                  deck: payload.deck,
//                  selector: {
//                      type: 'slide',
//                      id: payload.selector.id
//                  }
//            }, done);
//            
//        } else {
//            //hide slider control
//            context.executeAction(deckActions.hideSliderControl, {}, done);
//        }
    //context.executeAction(deckActions.forceLoadSlides, {deck:payload.deck, selector: {type: payload.selector.type, id: payload.selector.id}}, done);
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





