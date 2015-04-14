'use strict';
var React = require('react');
var StoreMixin = require('fluxible').Mixin;
var UserStore = require('../stores/UserStore');
var md5 = require('MD5');
var dateFormat = require('../assets/js/dateformat');

var UserPage = React.createClass({
  mixins: [StoreMixin],
  getInitialState: function () {

    return this.getStateFromStores();
  },
  getStateFromStores: function () {
    return {
      error: this.getStore(UserStore).getError(),
      ObjectData: this.getStore(UserStore).getObject()
    };
  },
    render: function() {

      
      var prettyDate = dateFormat(this.state.ObjectData.registered, 'dd mmm yyyy');
      var descTempl = <p>No description written by user</p>;

      var dtTempl = null;
      var fbTempl = null;
      var iDeckTempl = null;

      var hashEmail = md5(this.state.ObjectData.email);

      var source = "http://www.gravatar.com/avatar/"+ hashEmail +"?s=128&d=wavatar";

      if (this.state.ObjectData.default_theme){
        dtTempl = [<td className="title">Theme:</td>, <td>{this.state.ObjectData.default_theme}</td>];
      }
      if (this.state.ObjectData.fb_id){
        fbTempl = [<td className="title">FB ID:</td>,<td>{this.state.ObjectData.fb_id}</td>];
      }
      if (this.state.ObjectData.infodeck){
        iDeckTempl = [<td className="title">Infodeck:</td>,<td>{this.state.ObjectData.infodeck}</td>];
      }
      if (this.state.ObjectData.description){
        descTempl = <p>{this.state.ObjectData.description}</p>;
      }
      if (this.state.ObjectData.picture){
        source = this.state.ObjectData.picture;
      }
      return (
          <div className="ui page grid">
            <h2 className="user"><a href={this.state.ObjectData.id}>{this.state.ObjectData.username}</a></h2>
            <div className="row body">
              <div className="three wide column">
                <img className="rounded" src={source} alt="Profile Picture" height="128" width="128" />
              </div>
              <div className="five wide column">
              <table className="user">
                <tr>
                  <td className="title">Email:</td>
                  <td>{this.state.ObjectData.email}</td> 
                </tr>
                <tr>
                  <td className="title">Registered:</td>
                  <td>{prettyDate}</td> 
                </tr>
                {dtTempl}
                {fbTempl}
                {iDeckTempl}
              </table>
              </div>
              <div className="message eight wide column">
                {descTempl}
              </div>
            </div>     
          </div>
        );
    }
});

module.exports = UserPage;
