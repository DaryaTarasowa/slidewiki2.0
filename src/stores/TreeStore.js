'use strict';
var createStore = require('fluxible/utils/createStore');
var _ = require('lodash');
var t = require('t');
var debug = require('debug');
var Immutable = require('immutable');
var async = require('async');
var agent = require('superagent');
var api = require('../configs/config').api;
//error messages: 
var internal =  {message : 'An internal error occured, please try one more time'};



module.exports = createStore({
    storeName: 'TreeStore',
    handlers: {
        'SHOW_DECK_TREE_START': '_showDeckTreeStart',
        'SHOW_DECK_TREE_FAILURE': '_showDeckTreeFailure',
        'SHOW_DECK_TREE_SUCCESS': '_showDeckTreeSuccess',
        'UPDATE_TREE_NODE_SELECTOR': '_updateSelector',
        ENRICH_TREE_NODE_SELECTOR : '_enrichSelector',
        'ON_DRAG_START': '_onDragStart',
        'CHECK_DROP_POSSIBLE' : '_checkDropPossible',
        'MOVE_ITEM' : 'move_item',
        UPDATE_INDEXES : 'update_indexes',
        'ON_DROP' : '_onDrop',
        'DELETE_FROM' : 'delete_from',
        'ADD_EMPTY_SLIDE' : 'addEmptySlide',
        'ON_DRAG_END' : '_onDragEnd',
        'SET_NEW_TITLE' : 'setNewTitle'
        
    },
    initialize: function () {
        //tree nodes
        this.nodes = {};
        //current node which is selected
        this.selector = {};
        this.selected = {};
        //holds a breadcrumb based on the selector
        this.breadcrumb = [];
        //holds a dragging item
        this.dragging = null;
        this.opened = [];
        this.allowDrop = false;

        this.targetDeck = null;
    },

    _onDragStart: function (payload) {
        this.dragging = payload;
        this.emitChange();
    }, 
    _onDragEnd : function(){
        this.dragging = {};
        this.emitChange();
    },
    setNewTitle : function(payload){
        var self = this;
        agent
                .get(api.path + '/rename/' + payload.type + '/' + payload.id + '/' + payload.new_title)
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                       self.emitChange();
                    }
                });
    },
    delete_from : function(payload){
        var self = this;
        agent
            .get(api.path + '/deleteFrom/'+payload.parent.id+'/'+payload.type+'/'+payload.id)
            .end(function(err, res){
                if (err){
                    self.error = internal;
                    return self.emitChange();
                }
                else{
                    var next = payload.parent.children[payload.index];
                    var selector, selected;
                    if (next){
                        selected = next;
                        selector = {id: next.id, type: next.type, title: next.title, parent: self.selector.parent};
                    }else{
                        next = self.selector.parent.state.item;
                        selector = {id: next.id, type: next.type, title: next.title, parent: self.selector.parent.props.parent};
                        selected = next;
                    }
                    self._updateSelector({selector: selector, selected: selected});
                    
                    
                    //self.selected = self.nodes;
                    //self.selector = {id: self.nodes.id, type: 'deck'};
                    return self.emitChange();
                }
            });
    },
    
    addEmptySlide : function(payload){
        //todo for now the user-id '3' is used - change it in treepanel
        //todo parent_deck_id should be different if slide is selected
        var self = this;
        var parent = payload.parent;
        console.log('parent');
        console.log(parent);
        var new_slide = payload.new_slide;
        agent
            .post(api.path + '/slide/new')
            .type('form')
            .send(new_slide)
            .end(function(err, res){
                if (err){
                    self.error = internal;
                    self.emitChange();
                }
                else{
                    new_slide.id = res.body.id;
                    new_slide.parentID = parent.id;
                    new_slide.type = 'slide';
                    
                    var max_f_index = _.max(parent.children, function(chr) { //adding unique f_index
                        if (chr.f_index.toString().indexOf(':') !== -1){
                            var index_arr = chr.f_index.toString().split(':');                            
                            return parseInt(index_arr[index_arr.length - 1]);
                        }else{
                            return parseInt(chr.f_index);
                        }
                    });
                    max_f_index = max_f_index.f_index + 1;
                    if (parent.f_index){
                        new_slide.f_index = parent.f_index + ':' + max_f_index;
                    }else{
                        new_slide.f_index = max_f_index; 
                    }
                    parent.children.splice(new_slide.position-1, 0, new_slide);
                    if (parent.id === self.nodes.id){
                        self.nodes = parent;
                    }
                    
                    self.emitChange();
                }
            });

      
    },
    
    _onDrop : function(payload){
        this.allowDrop = false;
        var self = this; 
        
        var source_index = payload.source_index + 1;
        var target_index = payload.target_index + 1;
        var source = payload.source_parent.id;
        var target = payload.target_parent.id;
        agent
                .get(api.path + '/moveItem/' + source + "/" + source_index + "/" + target + "/" + target_index) 
                .end(function(err, res){
                    if (err){
                        self.error = internal;
                        return self.emitChange();
                    }else{
                        if (res.body.error){
                            console.log(res.body.error[0]);
                        }else{
                            console.log('_onDrop done');
                            self.dragging = {};
                            self.emitChange();
                        }
                    }
                });
        
    },
    
    //::    {{source_deck : {f_index : f_index, id : id, type : type}, {target_deck : {f_index : f_incex, id : id}} * fn => fb(bool)
    _isCausingLoop: function(payload, done){
        console.log('_isCausing loop');
        var deckId = payload.target_deck.state.item.id;
        var itemId = payload.source_deck.state.item.id;
        var targetDeck = payload.target_deck;
        var i = 0;
        while (deckId > 0) {
            i++;
            if (itemId === deckId) {
                return done(true); //the moving causing loop
            } else {
                var new_parent = targetDeck.props.parent;
                if (new_parent){    
                    deckId = new_parent.state.item.id; 
                    targetDeck = new_parent;
                }else{                    
                    deckId = -1;
                }
               
            }
        }
        
        return done(false); //the moving does not cause loop
    },
    //::     {f_index : f_index} * this.dragging * fn => fn(bool)
    _checkDropPossible : function(payload, done){ 
        var self = this;
        if (this.dragging){
            
            if (this.dragging.state.item.type === 'slide'){
                self.allowDrop = true;
                console.log('checkdrposs slide done');
                console.log(self.allowDrop);
                self.emitChange();

            }else{
                var target_item = payload.state.item;
                if (target_item.type ==='slide'){
                    var parent = payload.props.parent;
                    if (parent.state.item.id === self.nodes.id){ //we are dropping in the root deck
                        self.allowDrop = true;
                        self.emitChange();
                    }else{
                        self._isCausingLoop({source_deck : self.dragging , target_deck : parent}, function(res){
                            self.allowDrop = !res;
                            console.log('checkdrposs deck-slide done');
                            console.log(self.allowDrop);
                            self.emitChange();
                        });
                    }
                }else{ //dropping target is a deck
                    self._isCausingLoop({source_deck : self.dragging, target_deck : payload}, function(res){
                        self.allowDrop = !res;
                        self.processing = false;
                        console.log('checkdrposs deck-deck done');
                        console.log(self.allowDrop);
                        self.emitChange();
                    });
                    
                }
            }
        }else{
            console.log('checkdrposs done');
            self.sllowDrop = false;
            console.log(self.allowDrop);
            self.emitChange();
        }
        
    },

    _openCloseTree: function () {
        this.isOpened = !this.isOpened;
        this.emitChange();
    },
    _showDeckTreeStart: function (res) {
        debug('Start loading the deck tree...');
    },
    _showDeckTreeFailure: function (res) {
        debug('Error in loading deck tree!');
        var self = this;
        this.error = true;
        self.emitChange();
    },
    _setIndexes : function(nodes, callback){ //to be able to produce keys for nodes
        var self = this;
        
        var mutated_notes = nodes.children.map(function(node, index){
            node = nodes.children[index];
            var new_index = index - 0 + 1;
            if (nodes.f_index){                
                node.f_index = nodes.f_index + ':' + new_index;
            }else{
                node.f_index = new_index;
            }
            if (self.dragging){
                if (node.id === self.dragging.id && node.type === self.dragging.type){
                    self.dragging.f_index = node.f_index;
                }
            }
            if (self.selector){
                if (node.id.toString() === self.selector.id.toString() && node.type.toString() === self.selector.type.toString()){
                    self.selector.f_index = node.f_index;
                }
            }
            if (node.children){
                return self._setIndexes(node, function(node){
                    return node;
                });
            }else{
                return node;
            };
        });
        nodes.children = mutated_notes;
        return callback(nodes);
    },
    _showDeckTreeSuccess: function (res) { //first time rendering
        this.selector = res.selector;
        var self = this;
        this._setIndexes(res.nodes, function(mutated){
            self.nodes = mutated;
            self.emitChange();
            self.findSelected(self.nodes, function(selected){
              
                self.selected = selected;
                self._createBreadcrumbInit(function (path) {
                    self.breadcrumb = path;
                    self.emitChange();
                });
            });            
        });
    }, 
    findSelected: function(nodes, callback){
        var self = this;
        var node = [];
      
        if (self.selector.type === 'deck' && self.selector.id === nodes.id){ //root deck is selected
            
            return callback(nodes);
        }else{
            var node = nodes.children.filter(function(item){
                return item.type === self.selector.type && item.id.toString() === self.selector.id.toString();
            });
            
            if (node.length){
                node[0].parentID = nodes.id;
                callback(node[0]);
            }else{
                nodes.children.map(function(node){
                    if (node.children){
                        self.findSelected(node, function(node_child){
                            if (node_child){
                                return callback(node_child);
                            }
                        });
                    }
                });
            }
        }
    },
    _enrichSelector: function(res){
        
        this.selector = res.selector;        
        this.emitChange();
    },
    _updateSelector: function(res) {
        var self = this;
        
        if (res.selector.id.toString() !== this.selector.id.toString() || res.selector.type.toString() !== this.selector.type.toString()){
            
            this.selector = res.selector;
            if (res.selected){
                this.selected = res.selected;
                self._createBreadcrumbInit(function(path){
                    self.breadcrumb = path;
                    self.emitChange();
                });
            }else{
                self.findSelected(self.nodes, function(selected){

                    self.selected = selected;
                    self._createBreadcrumbInit(function (path) {
                        self.breadcrumb = path;
                        self.emitChange();
                    });
                });   
            }
        }else{
            if (res.selector.mode.toString() !== this.selector.mode.toString()){
                this.selector = res.selector;
            }
        }
        
    },
    _createBreadcrumbInit: function (fn) {
        var found = 0;
        var self = this;
        //collect first level nodes for DFS
        var firstlevel = [];
        _.forEach(self.nodes.children, function (node) {
            if (node.type === 'deck') {
                firstlevel.push(node.id);
            }
        });
        
        var path = [];
        t.dfs(self.nodes, [], function (node, par, ctrl) {
            if (node.type === 'deck') {
                if (_.indexOf(firstlevel, node.id) > 0) {
                    path = [{
                            id: self.nodes.id,
                            title: self.nodes.title
                        }];
                }
                if (!found) {
                    path.push({
                        id: node.id,
                        title: node.title
                    });
                    
                }
            }
            if (node.id.toString() === self.selector.id.toString() && node.type.toString() === self.selector.type.toString()) {
                //prevent duplicate decks in path
                if (node.type !== 'deck') {
                    path.push({
                        id: node.id,
                        title: node.title
                    });
                }
                //id found
                found = 1;
                
                return fn(path);
            }
        });
    },
    
    _createBreadcrumb : function(selector, path_acc, callback){
        
        var self = this;
        if (selector.parent){ //not a root deck 
            path_acc.unshift({id : selector.id, title: selector.title});
            var selector = {id : selector.parent.state.item.id, title: selector.parent.state.item.title, parent: selector.parent.props.parent}
            self._createBreadcrumb(selector, path_acc, callback); //shift array, go to next level
        }else{ //root deck 
            path_acc.unshift({id : self.nodes.id, title: self.nodes.title});
            return callback(path_acc);
        } 
    },
    getBreadcrumb: function () {
        return this.breadcrumb;
    },
    getNodes: function () {
        
        return this.nodes;
    },
    getError: function () {
        return this.error;
    },
    getSelected: function(){
       return this.selected; 
    },
    //this method checks if we already received the complete tree
    //it is used for preventing rendering/API calls on each request
    //todo: we can change this on update actions to reload tree
    isAlreadyComplete: function (deck_id) {
        
        if (JSON.stringify(this.nodes) === '{}' || this.nodes.id.toString() !== deck_id.toString()) {
            //empty
            return false;
        } else {
            return true;
        }
    },
    getRootDeckID: function () {
        return this.nodes.id;
    },
    getRootDeckTitle: function () {
        return this.nodes.title;
    },
    getDragging: function () {
        return this.dragging;
    },
    getSelector: function () {
        return this.selector;
    },
    getAllowDrop: function() {
        return this.allowDrop;
    },
    getState: function () {
        return {
            nodes: this.nodes,
            selector: this.selector,
            breadcrumb: this.breadcrumb,
            isOpened: this.isOpened,
            dragging: this.dragging,
            allowDrop: this.allowDrop,
            selected: this.selected,
        };
    },
    dehydrate: function () {
        return {
            nodes: this.nodes,
            selector: this.selector,
            breadcrumb: this.breadcrumb,
            isOpened: this.isOpened,
            dragging: this.dragging,
            allowDrop: this.allowDrop,
            selected: this.selected,
        };
    },
    rehydrate: function (state) {
        this.nodes = state.nodes;
        this.selector = state.selector;
        this.breadcrumb = state.breadcrumb;
        this.isOpened = state.isOpened;
        this.dragging = state.dragging;
        this.allowDrop = state.allowDrop;
        this.selected = state.selected;
    }
});
