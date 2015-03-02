
var React = require('react');

var ContentMenu = React.createClass({
    
    render : function(){
        return (
                
            <div className="ui 7  fluid attached bottom small icon basic buttons">
                <div className="ui button" onClick={this.props.startShow}>
                    <a title="Slideshow">
                        <i className="green play icon"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="Self-assessment questions">
                        <i className="icon student purple"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="Comments">
                        <i className="comments red icon"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="download">
                      <i className="download icon"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="print">
                      <i className="print icon"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="export">
                      <i className="share external icon"></i>
                    </a>
                </div>
                <div className="ui button">
                    <a title="share">
                      <i className="share alternate icon"></i>
                    </a>
                </div>
            </div>    
        )
    }
});

module.exports = ContentMenu;
        
