'use strict';
var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new Fluxible({
    appComponent: React.createFactory(require('./components/Application.jsx'))
});
//plugin for managing routes
app.plug(routrPlugin({
    routes: require('./configs/routes')
}));
//plugin for Restful services
app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/TreeStore'));
app.registerStore(require('./stores/ContributorsStore'));
app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/ContentStore'));
app.registerStore(require('./stores/DeckStore'));
app.registerStore(require('./stores/SlideStore'));
app.registerStore(require('./stores/DeckSliderStore'));
app.registerStore(require('./stores/AuthStore'));



module.exports = app;
