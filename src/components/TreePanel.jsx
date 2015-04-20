'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;

var TreeStore = require('../stores/TreeStore');
var deckActions = require('../actions/DeckActions');
var treeActions = require('../actions/TreeActions');
var TreeNodes = require('./TreeNodes.jsx');

var update = require('react/lib/update');
var navigateAction = require('flux-router-component/actions/navigate');
var _ = require('lodash');


var TreePanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [TreeStore]
      }
    },
    getInitialState: function () {
       return this.getStateFromStores();
       
    },
    getStateFromStores: function () {
        return {
            error: this.getStore(TreeStore).getError(),
            item: this.getStore(TreeStore).getNodes(),
            selector: this.getStore(TreeStore).getSelector(),
            dragging: this.getStore(TreeStore).getDragging(),
            allowDrop: this.getStore(TreeStore).getAllowDrop(),
            selected: this.getStore(TreeStore).getSelected()
        };
    },
    _onChange: function() {
      
        this.setState(this.getStateFromStores());
    },

    deleteFrom : function(){
        var selected = this.state.selected;

        var selector = this.state.selector;
        var parent = selector.parent;
        if (parent){ //we selected not a root deck
            var index = _.findIndex(parent.state.item.children, function(chr) {
                return chr.f_index == selected.f_index;
            });
            

            
            this.props.context.executeAction(treeActions.deleteFrom, {parent: parent.state.item, type: selected.type, id: selected.id, index :index, deck: this.state.item.id});
//            parent.state.item.children.splice(index, 1);
//            parent.setState({item: parent.state.item});
        }
        
    },
    addEmptySlide : function(){
        var selected = this.state.selected;
        var selector = this.state.selector;
        var self = this;
        var position, parent;
        
        if (selector.type === 'slide'){
            
            parent = selector.parent.state.item;
            if (!parent) parent = this.state.item;
            var position = _.findIndex(parent.children, function(chr) {
                return chr.f_index == selected.f_index;
            });
            position += 2; //it is an index that's why + 1 and we need to add after => +2
            
        }else{
            parent = selected;
            if (!parent) parent = this.state.item;
            position = parent.children.length + 1;
        }
        var new_slide = {
            title: 'New Slide', 
            user_id: 3, 
            body : '', 
            language: 'en', 
            position : position,
            parent_deck_id : parent.id
        };
        
        this.props.context.executeAction(treeActions.addEmptySlide, {parent : parent, new_slide : new_slide, deck: this.state.item.id, selector: this.state.selector});

    },
    rememberOvered : function(overed){
        this.setState({overed: overed});
    },
    forgetOvered : function(){
        this.setState({overed: null});
    },
    unOver : function(){
        if (this.state.overed){
             this.state.overed.setState({isOvered: false});
        }       
    },
    moveItem: function(target){
        
        //if (this.state.dragging && this.state.allowDrop){
            console.log('==========');
            console.log(this.state);
            var dragging = this.state.dragging.props.item;
            console.log('dragging');
            console.log(dragging);
            var source_parent = this.state.dragging.props.parent.props.item;
            console.log('source parent');
            console.log(source_parent);
            console.log(target);
            var target_parent;
            var target_index;
            var source_index = source_parent.children.indexOf(dragging);
            console.log('source index');
            console.log(source_index);
            source_parent.children.splice(source_index, 1);
            console.log('-----------------');
            console.log(source_parent);
            if (target.props.item.type === 'slide'){ //dropping after the target slide
                target_parent = target.props.parent.props.item;
                target_index = target_parent.children.indexOf(target.props.item) + 1;
                console.log('target parent');
                console.log(target_parent);

                console.log('target index');
                console.log(target_index);

                target_parent.children.splice(target_index, 0, dragging);
                console.log('+++++++++++++++');
                console.log(target_parent);
                this.props.context.executeAction(treeActions._onDrop, {target_parent : target_parent, target_index: target_index, source_parent: source_parent, source_index: source_index});
                target.props.parent.setState({item: target_parent});
            }else{ //we are over a deck - dropping inside it on the 1st position
                target_parent = target.props.item;
                target_index = 0;
                console.log('target parent');
                console.log(target_parent);
                console.log('target index');
                console.log(target_index);

                target_parent.children.splice(target_index, 0, dragging);
                console.log('+++++++++++++++');
                console.log(target_parent);
                this.props.context.executeAction(treeActions._onDrop, {target_parent : target_parent, target_index: target_index, source_parent: source_parent, source_index: source_index});
                target.setState({item : target_parent});
            }
            
            
            this.state.dragging.props.parent.setState({item: source_parent});
            
              
       // }
    },
    
    render: function() {
        
        var tree
        var addButton=this.state.selector.type=='slide' ? <i className="blue add icon disabled"></i> : <i className="blue add icon"></i>;
        if (!this.state.error) {
          tree = <div className="sw-tree-panel">
            <div className="panel">
              <div className="3 fluid ui attached bottom tertiary small icon buttons">
                <div className="ui button" onClick = {this.addEmptySlide}>
                  {addButton}
                </div>
                <div className="ui button">
                  <i className="teal edit icon"></i>
                </div>
                <div className="ui button" onClick = {this.deleteFrom}>
                  <i className="red remove icon"></i>
                </div>
              </div>
              
              <div className="ui bottom attached segment  sw-tree-container">
                <TreeNodes 
                            key={'rootDeck' + this.state.item.id}
                            item={this.state.item}
                            position={1}
                            parentID={0}
                            rootID={this.state.item.id}
                            selector={this.state.selector} 
                            selected={this.state.selected} 
                            dragging={this.state.dragging}
                            isOpened={true} 
                            context={this.props.context}
                            ref={'rootDeck' + this.state.item.id}
                            parentRef={'0'}
                            allowDrop={this.state.allowDrop}
                            parent = {false}
                            moveItem = {this.moveItem}
                            rememberOvered = {this.rememberOvered}
                            forgetOvered = {this.forgetOvered}
                            unOver = {this.unOver}
                />
              </div>
            </div>
          </div>
        }else{
        tree = <div className="sw-tree-panel">{this.state}</div>
        } 

        return (
          <div>{tree}</div>
        )
    },
    componentDidMount: function() {
        //make the selected node visible in the view
        $(".sw-tree-view-selected").scrollIntoView();
        //load in slider       
        this.props.context.executeAction(navigateAction, 
            {
                type: 'click', 
                url: '/deck/' + this.state.item.id + '/' + this.state.selector.type + '/' + this.state.selector.id +'/'+this.state.selector.mode
            }); 
        
      
    },
    componentDidUpdate: function(prevProps, prevState){
        $(".sw-tree-view-selected").scrollIntoView();
        
        if (prevState.selector.id.toString() != this.state.selector.id.toString() 
            || prevState.selector.type.toString() != this.state.selector.type.toString() 
            || prevState.selector.mode.toString() != this.state.selector.mode.toString()){


            this.props.context.executeAction(navigateAction, 
            {
                type: 'click', 
                url: '/deck/' + this.state.item.id + '/' + this.state.selector.type + '/' + this.state.selector.id +'/'+this.state.selector.mode
            }); 
        }
    },
    
});

module.exports = TreePanel;
