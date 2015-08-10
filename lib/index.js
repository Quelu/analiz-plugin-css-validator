/**
 * Generic template for an Analiz module
 * @type {Object}
 */
module.exports = {

  /**
   * Configuration of the module
   * @type {Object}
   */
  config: {

    /**
     * Name of the plugin
     * @type {Object}
     */
    name: {
      'en': 'CSS validator',
      'fr': 'Validateur CSS'
    },


    /**
     * The plugin category (choose one in the documentation)
     * @type {String}
     */
    category: 'css',


    /**
     * List of the files the module will analize
     * @type {Array}
     */
    fileTypes: [
      '.css'
    ],


    /**
     * Options of the plugin
     * Array of option Object
     */
    options: [
      {
        name: 'profile',
        type: 'list',
        data: [ {
          name: 'No particular profile',
          value: 'none'
        },{
          name: 'CSS 1',
          value: 'css1'
        },{
          name: 'CSS 2',
          value: 'css2'
        },{
          name: 'CSS 2.1',
          value: 'css21'
        },{
          name: 'CSS 3',
          value: 'css3'
        },{
          name: 'SVG',
          value: 'svg'
        },{
          name: 'SVG Basic',
          value: 'svgbasic'
        },{
          name: 'SVG tiny',
          value: 'svgtiny'
        },{
          name: 'Mobile',
          value: 'mobile'
        },{
          name: 'atsc-tv',
          value: 'ATSC TV'
        },{
          name: 'tv',
          value: 'TV'
        } ]
      }, {
        name: 'usermedium',
        type: 'list',
        data : [{
          name: 'All',
          value: 'all'
        },{
          name: 'Aural',
          value: 'aural'
        },{
          name: 'Braille',
          value: 'braille'
        },{
          name: 'Embossed',
          value: 'embossed'
        },{
          name: 'Handled',
          value: 'handled'
        },{
          name: 'Print',
          value: 'print'
        },{
          name: 'Projection',
          value: 'projection'
        },{
          name: 'Screen',
          value: 'screen'
        },{
          name: 'TTY',
          value: 'tty'
        },{
          name: 'TV',
          value: 'tv'
        },{
          name: 'Presentation',
          value: 'presentation'
        }]
      },{
        name: 'warnings',
        type: 'list',
        data: [{
          name: 'Normal',
          value: 1
        },{
          name: 'All',
          value: 2
        },{
          name: 'Most important',
          value: 0
        },{
          name: 'No warnings',
          value: 'no'
        }]
      }
    ]
  },


  /**
   * Analize asynchronously the files send by Analiz and return the results to callback
   * @param  {Array} files          An array of the files send by Analiz
   * @param  {Object} options       Options chosen by the user
   * @param  {Function} callback    Callback to call after analyzing each file
   */
  run: function ( files, options, callback ) {
    var validateCss = require('css-validator');
    var fs = require('fs');

    files.forEach(function( file ) {
      fs.readFile( file, { encoding: 'utf-8' }, function ( err, data ) {
        if ( err ) {
          callback( err, null );
        }
        options.text = data;
        options.lang = options.language;

        validateCss( options, function ( err, data ) {
          var errors = [];

          data.errors.forEach(function( error ) {
            errors.push( {
              type: 'error',
              message: error.message.trim(),
              line: error.line
            } );
          });
          data.warnings.forEach(function( warning ) {
            errors.push( {
              type: 'warning',
              message:  warning.message.trim(),
              line: warning.line
            } );
          });

          var results = {
            file: file,
            errors: errors
          };

          callback( null, results );
        } );
      } );
    });
  }
};
