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
        if (date){
            try{created_at = dateFormat(date, 'dd mmm yyyy');}
            catch(err){created_at = null;}
        }
        return (
        <div>
            <div dangerouslySetInnerHTML={{__html: this.props.content.description}} />
            <div className="ui divider">

            </div>
            <ul className="ui list">

                <li>
                    Created at
                    {created_at}
                </li>
                <li>
                    Default style theme

                </li>
                <li>
                    Number of slides
                   {this.props.content.numberOfSlides}
                </li>
                <li>
                    Origin
                    {this.props.content.origin}
                </li>
            </ul>          
              
        </div>
          
        );
    }
});

module.exports = DeckView;
