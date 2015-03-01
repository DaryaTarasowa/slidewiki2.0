'use strict';
var React = require('react');
//SlideWiki components
var dateFormat = require('../assets/js/dateformat');

var DeckView = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function() {
        var date = new Date(this.props.content.created_at);
        var created_at;
        var created_at = dateFormat(date, 'dd mmm yyyy');
        console.log(this.props.content);
        return (
        <div className=" ui segment">
            <h6 className="ui horizontal divider">
                <i className="book green icon"></i>
                Abstract
            </h6>
            <div dangerouslySetInnerHTML={{__html: this.props.content.description}} />
            <h6 className="ui horizontal divider">
                <i className="list layout purple icon"></i>
                Metadata
            </h6>
            <table className="ui definition table">
                <tbody>
                    <tr>
                        <td className="six wide column">Created at</td>
                        <td>{created_at}</td>
                    </tr>
                    <tr>
                        <td>Default style theme</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Number of slides</td>
                        <td>{this.props.content.numberOfSlides}</td>
                    </tr>
                    <tr>
                        <td>Origin</td>
                        <td>{this.props.content.origin}</td>
                    </tr>
                </tbody>
            </table>
        </div>
          
        );
    }
});

module.exports = DeckView;
