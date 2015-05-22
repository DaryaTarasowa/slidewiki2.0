'use strict';
var React = require('react');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
var deckActions = require('../actions/DeckActions');
var DeckSliderStore = require('../stores/DeckSliderStore');


var PlayPage = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [DeckSliderStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
        
      return {
        slides: this.getStore(DeckSliderStore).getSlides(),
        theme: this.getStore(DeckSliderStore).getTheme()
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    render: function() {
        var background='';
        
        var output = this.state.slides.map(function(node,index){
            return (
                    <section key={node.id} data-background={background}>
                        <h3>{node.title}</h3>
                        <div dangerouslySetInnerHTML={{__html: node.body}} />
                    </section>
            )
        })
       
        return (
            <div className="reveal">
                <div className="slides" >
                
                 {output}
                 
                </div>
            </div>
        );
    },
    componentWillUnmount : function(){
        document.getElementById('theme').setAttribute('href', ''); 
    },
    componentDidMount : function(){
        if (this.state.theme){
            var url = '/public/css/themes/' + this.state.theme + '.css';
            document.getElementById('theme').setAttribute('href', url); 
        }
     Reveal.initialize({
          // The "normal" size of the presentation, aspect ratio will be preserved
    // when the presentation is scaled to fit different resolutions. Can be
    // specified using percentage units.
    
    // Factor of the display size that should remain empty around the content
   // margin: 0.5,

    // Bounds for smallest/largest possible scale to apply to content
    //minScale: 0,
    //maxScale: 1,

    // Display controls in the bottom right corner
    controls: true,
    // Display a presentation progress bar
    progress: true,
    // Display the page number of the current slide
    slideNumber: true,
    // Push each slide change to the browser history
    history: false,
    // Enable keyboard shortcuts for navigation
    keyboard: true,
    // Enable the slide overview mode
    overview: false,
    // Vertical centering of slides
    center: true,
    // Enables touch navigation on devices with touch input
    touch: true,
    // Loop the presentation
    loop: false,
    // Change the presentation direction to be RTL
    rtl: false,
    // Turns fragments on and off globally
    fragments: false,
    // Flags if the presentation is running in an embedded mode,
    // i.e. contained within a limited portion of the screen
    embedded: true,
    // Flags if we should show a help overlay when the questionmark
    // key is pressed
    help: true,
    // Number of milliseconds between automatically proceeding to the
    // next slide, disabled when set to 0, this value can be overwritten
    // by using a data-autoslide attribute on your slides
    autoSlide: 0,
    // Stop auto-sliding after user input
    autoSlideStoppable: true,
    // Enable slide navigation via mouse wheel
    mouseWheel: true,
    // Hides the address bar on mobile devices
    hideAddressBar: true,
    // Opens links in an iframe preview overlay
    previewLinks: true,
    // Transition style
    transition: 'fade', // none/fade/slide/convex/concave/zoom
    // Transition speed
    transitionSpeed: 'slow', // default/fast/slow
    // Transition style for full page slide backgrounds
    backgroundTransition: 'convex', // none/fade/slide/convex/concave/zoom
    // Number of slides away from the current that are visible
    viewDistance: 3,
    // Parallax background image
    parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
    // Parallax background size
    parallaxBackgroundSize: '' // CSS syntax, e.g. "2100px 900px"


});
  },
});

module.exports = PlayPage;