var React=require('react');


function getSlideViewState() {
  return {

  };
}
var SlideView= React.createClass({
  //list of properties for validation
  propTypes: {
    id: React.PropTypes.number.isRequired,
    content: React.PropTypes.object
  },
  getInitialState: function() {
    return getSlideViewState();
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },
  render: function(){
    return (
      <div className="sw-slide">
        <h3> Slide {this.props.id} </h3>
        <h4> {this.props.content.body} </h4>
      </div>
    )
  },
  _onChange: function() {
    this.setState(getSlideViewState());
  }
})
module.exports= SlideView;