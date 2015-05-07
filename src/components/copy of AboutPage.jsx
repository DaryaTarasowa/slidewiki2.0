'use strict';
var React = require('react');

var AboutPage = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <h2 className="ui header">About</h2>
                <p>Welcome!</p>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = AboutPage;
