'use strict';
var React = require('react');

var About = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <h2 className="ui header">About</h2>
                <p>Here comes the description of the SlideWiki.</p>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = About;