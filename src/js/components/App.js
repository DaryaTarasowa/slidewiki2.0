var React=require('react');

//bootstrap components
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
//SlideWiki components
var TreePanel=require('./TreePanel');
var ContentPanel=require('./ContentPanel');
var ContributorsPanel=require('./ContributorsPanel');
var DeckHeader=require('./DeckHeader');
var App= React.createClass({
  render: function() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}> <DeckHeader /> </Col>
        </Row>
        <Row>
          <Col md={3}> <TreePanel /> </Col>
          <Col md={6}> <ContentPanel /> </Col>
          <Col md={3}> <ContributorsPanel /> </Col>
        </Row>
      </Grid>

    );
  }
});
module.exports= App;
