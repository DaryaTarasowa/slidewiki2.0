'use strict';
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var FluxibleMixin = require('fluxible').Mixin;
var RouterMixin = require('flux-router-component').RouterMixin;

var DefaultLayout = React.createClass({
    mixins: [FluxibleMixin, RouterMixin],
    render: function() {
        
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>{this.getStore(ApplicationStore).getPageTitle()}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/public/bower_components/semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />
                <link href="/public/bower_components/wysiwyg.js/src/wysiwyg-editor.css" rel="stylesheet" type="text/css" />
                <link href="/public/css/bundle.css" rel="stylesheet" type="text/css" />
                <link rel="stylesheet" href="" id="theme" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
            </head>
            <body>
                  <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/public/bower_components/jquery/dist/jquery.min.js" defer></script>
            <script src="/public/bower_components/semantic-ui/dist/components/progress.min.js" defer></script>
            <script src="/public/bower_components/keymaster/keymaster.js" defer></script>
            <script src="/public/bower_components/screenfull/dist/screenfull.min.js" defer></script>
            <script src="/public/js/jQuery.scrollIntoView.min.js" defer></script>
            <script src="/public/bower_components/reveal.js/js/reveal.js" defer></script>
            <script src="/public/bower_components/wysiwyg.js/src/wysiwyg-editor.js" defer></script>
            <script src="/public/bower_components/wysiwyg.js/src/wysiwyg.js" defer></script>
            <script src="/public/js/bundle.js" defer></script>
            <script src="/public/bower_components/reveal.js/lib/js/head.min.js" defer></script>

            </html>
        );
    }
});

module.exports = DefaultLayout;
