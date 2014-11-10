
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _nodes={};
//current root deck
var _deck_id;
//current node which is selected
var _selector={};

/**
  private functions
 */

var _initTree= function(nodes, deck_id, selector){
  _nodes=nodes;
  _deck_id=deck_id;
  _selector=selector;
}

var AppTreeStore = assign({}, EventEmitter.prototype, {

  /**
  public functions
   */
  getNodes: function (){
    return _nodes;
  },
  getDeckID: function (){
    return _deck_id;
  },
  getSelector: function (){
    return _selector;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case AppConstants.APP_LOAD_DECK_TREE:
      //do something
      _initTree(action.nodes, action.deck_id, action.selector);
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  AppTreeStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = AppTreeStore;