'use strict';
var React = require('react');
var ItemTypes = require('../configs/ItemTypes');
var cx = require('react/lib/cx');
var navigateAction = require('flux-router-component/actions/navigate');
var treeActions = require('../actions/TreeActions');
var deckActions = require('../actions/DeckActions');
var async = require('async');

function shorten(title){
    return title.length > 20 ? title.substring(0, 17) + '...' : title;
}

var TreeNodes = React.createClass({
    getInitialState: function(){
        
        return {
            isOpened : this.props.isOpened || false,
            isOvered : false,
            item: this.props.item,
            titleInput : false
        }
    },
    //executed only first time
    
    componentWillUnmount: function(){
      key.unbind('enter');
    },
    _onEnterClick: function(e){
        if (this.state.titleInput && e.keyCode === 13){
            var new_title = e.target.value;
            if (new_title !== this.props.item.title && new_title){
                var payload={type: this.props.item.type, id: this.props.item.id, new_title: new_title};
                this.props.context.executeAction(treeActions.setNewTitle, payload);
                var item = this.state.item;
                item.title = new_title;
                this.setState({item : item, titleInput: false});
            }else{
                this.setState({titleInput : false})
            }
        }
    },
    switchOpened : function(){
        var newState = this.state.isOpened;
        this.setState({isOpened : !newState});
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render : function() { 
  
        var self = this;
        //it has a fixed value
        var selector=this.props.selector;
        var context=this.props.context;
        var rootID=this.props.rootID;
        
        //handling css classes
        var isSelected= (this.props.item.type==this.props.selector.type && this.props.item.id==this.props.selector.id && this.props.item.f_index == this.props.selected.f_index);
        var isDragging;
        if (this.props.dragging) {
            if (this.props.dragging.state){
                isDragging = (this.props.item.f_index==this.props.dragging.state.item.f_index);
            }else{
                isDragging = false;
            }
        } else {
            isDragging = false;
        };
        var isDraggable= (!(this.props.item.type=="deck" && this.props.item.id==this.props.rootID));
        var isOvered = this.state.isOvered;
        var title = this.state.titleInput;
        var isSlide = (this.props.item.type=="slide");
        var isDeck = (this.props.item.type=="deck");
        //cx is used to handle adding classes by condition
        var nodeClasses = cx({
            'sw-tree-view-node': true,
            'sw-tree-view-selected': isSelected,
            'sw-tree-view-deck': isDeck,
            'sw-tree-view-slide': isSlide
        });
        var path=this._getPath();
        
        var nodeIcon;
        if (this.props.item.type==="deck"){
            nodeIcon = this.state.isOpened  ?   <i className="icon caret down top aligned" onClick={self.switchOpened}></i>
                                            :   <i className="icon caret right top aligned" onClick={self.switchOpened}></i>;
        }
        var titleString = this.state.titleInput ? 
                                                    <div className="ui small transparent input active icon">
                                                        {nodeIcon}<input type="text" ref="titleInput" placeholder={this.props.item.title} onKeyDown = {this._onEnterClick}/>
                                                    </div> 
                                                : 
                                                    <div>{nodeIcon}{shorten(this.props.item.title)}</div>
        
        //handling child nodes
        var output;
        var childNodes, childNumber = 0;
        if(this.props.item.children) {
            childNumber=this.props.item.children.length; 
            output = 
                this.props.item.children.map(function(node, index) {  
           
                return (
                    <div className="item" key={node.f_index} style = {{display: self.state.isOpened ? 'block' : 'none'}}>
                        <TreeNodes
                            item = {node}
                            position={index + 1}
                            parentID={self.state.item.id}
                            parent = {self}
                            parentRef={self.props.ref}
                            rootID={self.props.rootID}
                            ref={node.f_index}
                            selector={self.props.selector}
                            selected={self.props.selected}
                            dragging={self.props.dragging}
                            allowDrop={self.props.allowDrop}
                            context={self.props.context} 
                            className={index==(childNumber-1)?'last-child':''}
                            moveItem = {self.props.moveItem}
                            rememberOvered = {self.props.rememberOvered}
                            forgetOvered = {self.props.forgetOvered}
                            unOver = {self.props.unOver}
                        /> 
                    </div>
                );
            })
        };
      
            
   
        return (
                <div>
                    <div className="sw-tree-view" ref='tree' style={{display: isDragging ? 'none' : 'block'}}>
                        <div ref="treeNode"
                            className={nodeClasses}
                            onMouseOver={this._onMouseOver} 
                            onMouseOut={this._onMouseOut}
                            draggable = {isDraggable}
                            
                            onDragStart = {this._onDragStart}
                            onDragEnd = {this._onDragEnd}
                            onDrop = {this._onDrop} onDragEnter={this._onDragEnter} onDragOver = {this._onDragOver}
                            
                            onDragLeave={this._onDragLeave}
                        >   
                            <div className="ui labeled fluid">
                                <div href={path} context={this.props.context}  onClick={this._onClick} >
                                    <div ref="actionBar" className="sw-hidden" >
                                        <i className="small ellipsis vertical icon"></i>
                                        {this.props.item.type=='deck'? <i className="small blue icon add link"></i> :''}
                                        <i className="small teal icon edit link" onClick={this.showTitleInput}></i>
                                        <i className="small red icon remove link"></i>
                                    </div>
                                    {titleString}
                                </div>
                            </div>
                        </div>


                        {childNumber?   <div className="ui list">
                                            <div onDrop = {this._onDrop} onDragEnter={this._onDragEnter} onDragOver = {this._onDragOver} className="item sw-empty-item" style={{display : isOvered && isDeck ? 'block' : 'none'}}></div>
                                            {output}
                                        </div>:''}
                    </div>
                    <div onDrop = {this._onDrop} onDragEnter={this._onDragEnter} onDragOver = {this._onDragOver} className='sw-empty-item' style={{display : isOvered && isSlide ? 'block' : 'none'}}></div>
                </div>
            );
    },
    showTitleInput: function(e){
        this.setState({titleInput : true}, function(){
            var current = this.refs.titleInput.getDOMNode();
            current.focus();
            current.setSelectionRange(0, 0);
        });
    },
    _onClick: function(e) {
        
        
        this.props.context.executeAction(deckActions.loadUpdateTree, 
        
            {
                deck: this.props.rootID, 
                selector: {
                    type: this.props.item.type,
                    id: this.props.item.id,
                    mode: this.props.selector.mode
                }
            } );

        e.preventDefault();
    },
    _onDragStart : function(e) {
        if (this.state.item.id !== this.props.rootID){
            var draggingItem = this;
            this.setState({isOpened : false});
            this.props.context.executeAction(treeActions._onDragStart, draggingItem);
            e.dataTransfer.setData('Text', 'text');            
            e.stopPropagation(); 
            
        }else{
            e.preventDefault();
        }
    },
    _onDragEnd : function(e){
        this.setState({ 'isOvered' : false});
        this.props.context.executeAction(treeActions._onDragEnd);
        this.props.unOver();
        this.props.forgetOvered();
    },
    _onDragEnter: function(e){ // Necessary. Allows us to drop.       
        if (this.props.dragging.state.item.type !== this.props.item.type || this.props.dragging.state.item.id !== this.props.item.id)  {
            e.preventDefault(); 
            e.stopPropagation();
            this.props.unOver();
            
            var self = this;
            self.setState({isOpened : true, isOvered : true});
            this.props.rememberOvered(this);
        }
    },
    _onDragLeave: function(e){
        //this.setState({ 'isOvered' : false});
    },        
    _onDragOver: function(e){ // Necessary. Allows us to drop.
        e.preventDefault(); 
        e.stopPropagation();
    },
    _onDrop : function(e) {
        //allowDrop here!
        if (this.props.dragging.state.item.type !== this.props.item.type || this.props.dragging.state.item.id !== this.props.item.id){
            e.preventDefault();
            e.stopPropagation();
            this.setState({'isOpened' : true, 'isOvered' : false});
            //if (this.props.allowDrop){
                this.props.moveItem(this);
        }
    }, 
    _getPath: function() {
        return '/deck/'+this.props.rootID+'/'+this.props.item.type + '/' + this.props.item.id;
    },
    _onMouseOver: function(e) {
        var current = this.refs.tree.getDOMNode();
        current.className += " sw-tree-view-over"
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className ="ui label right floated sw-action-bar";
    },
    _onMouseOut: function(e) {
        var current = this.refs.tree.getDOMNode();
        var re = / sw-tree-view-over/gi;
        var newClasses=current.className.replace(re, "");
        current.className=newClasses
        var actionBar = this.refs.actionBar.getDOMNode();
        actionBar.className = "sw-hidden";
    },
    componentDidUpdate: function(e){
        
        if (this.props.item.type.toString()==this.props.selector.type.toString() && this.props.item.id.toString()==this.props.selector.id.toString() && this.props.item.f_index == this.props.selected.f_index){
            
            if (!this.props.selector.title){
                this.props.context.executeAction(treeActions._updateSelector, {
                    selector: {
                        title:this.state.item.title,
                        type: this.state.item.type, 
                        id: this.state.item.id, 
                        parent: this.props.parent,
                        mode:this.props.selector.mode
                    }, 
                });
            }            
        }
    },
    componentDidMount: function(e){
        key('enter', this._onEnterClick);
        if (this.props.item.type.toString()==this.props.selector.type.toString() && this.props.item.id.toString()==this.props.selector.id.toString() && this.props.item.f_index == this.props.selected.f_index){
            
            if (!this.props.selector.title){
                this.props.context.executeAction(treeActions._updateSelector, {
                    selector: {
                        title:this.state.item.title,
                        type: this.state.item.type, 
                        id: this.state.item.id, 
                        parent: this.props.parent,
                        mode:this.props.selector.mode
                    }, 
                });
            }            
        }
    }
});


module.exports = TreeNodes;

