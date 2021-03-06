'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
var navigateAction = require('flux-router-component/actions/navigate');
var TreeStore = require('../stores/TreeStore');
//SlideWiki components

var Breadcrumb = React.createClass({
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
          breadcrumb: this.getStore(TreeStore).getBreadcrumb()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        var path;
        var breadcrumb;
        var itemNumber=this.state.breadcrumb.length
        var self=this;
        if (!this.state.error){
            breadcrumb = this.state.breadcrumb.map(function(node, index) {
                if(index==itemNumber-1){
                  return <div key={index} className='section active'> {node.title} </div>
                }else{
                  path=self._getPath('deck', node.id);
                  return <div key={index} className='section'><a href={path} context={self.props.context} > {node.title} </a><i className="right chevron icon divider"></i></div>
                }
              });
        }else{
            breadcrumb = <div>error</div>
        }
        
        return (
          <div className="sw-breadcrumb">
              <div className="ui breadcrumb">
                {breadcrumb}
              </div>
          </div>
        );
    },
  _getPath: function(type,id) {
      return '/deck/'+this.state.breadcrumb[0].id+'/'+type + '/' + id;
  },
  _onClick: function(id,e) {
    e.preventDefault();
    this.props.context.executeAction(navigateAction, {url: this._getPath('deck', id)});
  },
});

module.exports = Breadcrumb;
