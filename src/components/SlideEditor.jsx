'use strict';
var React = require('react');
var SlideStore = require('../stores/SlideStore');
var navigateAction = require('flux-router-component/actions/navigate');
var StoreMixin = require('fluxible').Mixin;
//SlideWiki components
var ContentMenu = require('./ContentMenu.jsx');
var TranslationButton = require('./TranslationButton.jsx');

var SlideEditor = React.createClass({
    mixins: [StoreMixin],
    statics: {
      storeListeners: {
        _onChange: [SlideStore]
      }
    },
    getInitialState: function () {
      return this.getStateFromStores();
    },
    getStateFromStores: function () {
      return {
        content: this.getStore(SlideStore).getContent(),
      };
    },
    _onChange: function() {
      this.setState(this.getStateFromStores());
    },
    componentDidUpdate: function(){
        var element = this.refs.wysiwyg.getDOMNode();
        $(element).wysiwyg({
            classes: 'buttons small compact icon sw-force-blue',
            // 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
            toolbar:  'top',
            buttons: {
                
                insertimage: {
                    title: 'Insert image',
                    image: '<i class="icon camera"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                insertvideo: {
                    title: 'Insert video',
                    image: '<i class="icon video camera"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                insertlink: {
                    title: 'Insert link',
                    image: '<i class="icon external link"></i>' // <img src="path/to/image.png" width="16" height="16" alt="" />
                },
                // Fontname plugin
                fontname: {
                    title: 'Font',
                    image: '<i class="icon font"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    popup: function( $popup, $button ) {
                            var list_fontnames = {
                                    // Name : Font
                                    'Arial, Helvetica' : 'Arial,Helvetica',
                                    'Verdana'          : 'Verdana,Geneva',
                                    'Georgia'          : 'Georgia',
                                    'Courier New'      : 'Courier New,Courier',
                                    'Times New Roman'  : 'Times New Roman,Times'
                                };
                            var $list = $('<div/>').addClass('wysiwyg-toolbar-list')
                                                   .attr('unselectable','on');
                            $.each( list_fontnames, function( name, font ){
                                var $link = $('<a/>').attr('href','#')
                                                    .css( 'font-family', font )
                                                    .html( name )
                                                    .click(function(event){
                                                        $(element).wysiwyg('shell').fontName(font).closePopup();
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           },
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                // Fontsize plugin
                fontsize: {
                    title: 'Size',
                    image: '<i class="icon text height"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    popup: function( $popup, $button ) {
                            var list_fontsizes = {
                                // Name : Size
                                'Huge'    : 7,
                                'Larger'  : 6,
                                'Large'   : 5,
                                'Normal'  : 4,
                                'Small'   : 3,
                                'Smaller' : 2,
                                'Tiny'    : 1
                            };
                            var $list = $('<div/>').addClass('wysiwyg-toolbar-list')
                                                   .attr('unselectable','on');
                            $.each( list_fontsizes, function( name, size ){
                                var $link = $('<a/>').attr('href','#')
                                                    .css( 'font-size', (8 + (size * 3)) + 'px' )
                                                    .html( name )
                                                    .click(function(event){
                                                        $(element).wysiwyg('shell').fontSize(size).closePopup();
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           }
                    //showstatic: true,    // wanted on the toolbar
                    //showselection: true    // wanted on selection
                },
                // Header plugin
                header: {
                    title: 'Header',
                    image: '<i class="icon header"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    popup: function( $popup, $button ) {
                            var list_headers = {
                                    // Name : Font
                                    'Header 1' : '<h1>',
                                    'Header 2' : '<h2>',
                                    'Header 3' : '<h3>',
                                    'Header 4' : '<h4>',
                                    'Header 5' : '<h5>',
                                    'Header 6' : '<h6>',
                                    'Code'     : '<pre>'
                                };
                            var $list = $('<div/>').addClass('wysiwyg-toolbar-list')
                                                   .attr('unselectable','on');
                            $.each( list_headers, function( name, format ){
                                var $link = $('<a/>').attr('href','#')
                                                     .css( 'font-family', format )
                                                     .html( name )
                                                     .click(function(event){
                                                        $(element).wysiwyg('shell').format(format).closePopup();
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           }
                    //showstatic: true,    // wanted on the toolbar
                    //showselection: false    // wanted on selection
                },
                bold: {
                    title: 'Bold (Ctrl+B)',
                    image: '<i class="icon bold"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    hotkey: 'b'
                },
                italic: {
                    title: 'Italic (Ctrl+I)',
                    image: '<i class="icon italic"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    hotkey: 'i'
                },
                underline: {
                    title: 'Underline (Ctrl+U)',
                    image: '<i class="icon underline"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    hotkey: 'u'
                },
                strikethrough: {
                    title: 'Strikethrough (Ctrl+S)',
                    image: '<i class="icon strikethrough"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    hotkey: 's'
                },
                forecolor: {
                    title: 'Text color',
                    image: '<i class="icon paint brush"></i>' // <img src="path/to/image.png" width="16" height="16" alt="" />
                },
                highlight: {
                    title: 'Background color',
                    image: '<i class="icon tint"></i>' // <img src="path/to/image.png" width="16" height="16" alt="" />
                },
                alignleft: {
                    title: 'Left',
                    image: '<i class="icon align left"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                aligncenter: {
                    title: 'Center',
                    image: '<i class="icon align center"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                alignright: {
                    title: 'Right',
                    image: '<i class="icon align right"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                alignjustify: {
                    title: 'Justify',
                    image: '<i class="icon align justify"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                subscript: {
                    title: 'Subscript',
                    image: '<i class="icon subscript"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: true    // wanted on selection
                },
                superscript: {
                    title: 'Superscript',
                    image: '<i class="icon superscript"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: true    // wanted on selection
                },
                indent: {
                    title: 'Indent',
                    image: '<i class="icon indent"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                outdent:  {
                    title: 'Outdent',
                    image: '<i class="icon outdent"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                orderedList:  {
                    title: 'Ordered list',
                    image: '<i class="icon list ol"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                unorderedList:  {
                    title: 'Unordered list',
                    image: '<i class="icon list ul"></i>', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                removeformat: {
                    title: 'Remove format',
                    image: '<i class="icon eraser"></i>' // <img src="path/to/image.png" width="16" height="16" alt="" />
                }
            },
            // Submit-Button
            submit: {
                title: 'Submit',
                image: '<i class="icon check"></i>' // <img src="path/to/image.png" width="16" height="16" alt="" />
            },
            // Other properties
            dropfileClick: 'Drop image or click',
            placeholderUrl: 'www.example.com',
            placeholderEmbed: '<embed/>',
            maxImageSize: [600,200],
            /*
            onImageUpload: function( insert_image ) {
                            // Used to insert an image without XMLHttpRequest 2
                            // A bit tricky, because we can't easily upload a file
                            // via '$.ajax()' on a legacy browser.
                            // You have to submit the form into to a '<iframe/>' element.
                            // Call 'insert_image(url)' as soon as the file is online
                            // and the URL is available.
                            // Best way to do: http://malsup.com/jquery/form/
                            // For example:
                            //$(this).parents('form')
                            //       .attr('action','/path/to/file')
                            //       .attr('method','POST')
                            //       .attr('enctype','multipart/form-data')
                            //       .ajaxSubmit({
                            //          success: function(xhrdata,textStatus,jqXHR){
                            //            var image_url = xhrdata;
                            //            console.log( 'URL: ' + image_url );
                            //            insert_image( image_url );
                            //          }
                            //        });
                        },*/
            videoFromUrl: function( url ) {
                // Contributions are welcome :-)

                // youtube - http://stackoverflow.com/questions/3392993/php-regex-to-get-youtube-video-id
                var youtube_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?(?:youtu\.be|youtube\.com)\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/)([^\?&\"'>]+)/ );
                if( youtube_match && youtube_match[1].length == 11 )
                    return '<iframe src="//www.youtube.com/embed/' + youtube_match[1] + '" width="640" height="360" frameborder="0" allowfullscreen></iframe>';

                // vimeo - http://embedresponsively.com/
                var vimeo_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?vimeo\.com\/([0-9]+)$/ );
                if( vimeo_match )
                    return '<iframe src="//player.vimeo.com/video/' + vimeo_match[1] + '" width="640" height="360" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

                // dailymotion - http://embedresponsively.com/
                var dailymotion_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?dailymotion\.com\/video\/([0-9a-z]+)$/ );
                if( dailymotion_match )
                    return '<iframe src="//www.dailymotion.com/embed/video/' + dailymotion_match[1] + '" width="640" height="360" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

                // undefined -> create '<video/>' tag
            },
            onKeyPress: function( code, character, shiftKey, altKey, ctrlKey, metaKey ) {
                            // E.g.: submit form on enter-key:
                            //if( (code == 10 || code == 13) && !shiftKey && !altKey && !ctrlKey && !metaKey ) {
                            //    submit_form();
                            //    return false; // swallow enter
                            //}
                        }
        })
        .change(function(){
            if( typeof console != 'undefined' )
                console.log( 'change' );
        })
        .focus(function(){
            if( typeof console != 'undefined' )
                console.log( 'focus' );
        })
        .blur(function(){
            if( typeof console != 'undefined' )
                console.log( 'blur' );
        });
       
    },
    render: function() {
        return (
                <div className="sw-slide-panel">
                    <div className="panel">
                        <div className="ui top secondary blue attached segment">
                            <h3 className="ui header">
                                <div className="content">
                                    {this.state.content.title}
                                </div>
                            </h3>
                            <TranslationButton context = {this.props.context} content={this.state.content}/>
                        </div>
                        <ContentMenu startShow = {this.startShow} />
                        <div className="ui attached segment">
                            <div className="sw-slide" id="sw_slide">
                                <div className="ui segment sw-slide">
                                    <div> {this.state.content.body} </div>
                                </div>
                            </div>
                        </div>
                        
                            
                        <div className="ui attached segment sw-blue-border sw-slide sw-force-white" 
                            ref="wysiwyg" 
                            dangerouslySetInnerHTML={{__html: this.state.content.body}} 
                        />
                                
                                
                           
                     
                        
                    </div>
                </div>
       
          
        );
    }
});

module.exports = SlideEditor;

