module.exports = function (grunt) {

  //pure javascript:
  var nodePaths = ['app_server/**/*.js', 'app_api/**/*.js'];
  var browserPaths = ['src/**/*.js'];
  var jsPaths = nodePaths.concat(browserPaths);
  jsPaths.push('Gruntfile.js');

  //JSX paths:
  var jsxPaths = ['src/**/*.jsx'];

  //Jade paths:
  var jadePaths = ['app_server/views/**/*.jade'];

  //load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-puglint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //configure plugins
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      target: jsxPaths
    },
    jshint: {
      options: {

        //environments:
        browser: true,
        jquery: true,
        devel: true,
        node: true,

        //other options:
        bitwise: true,
        curly: true,
        eqeqeq: true,
        esversion: 6,
        forin: true,
        globals: {
          Modernizr: false,
          gapi: false,
          google: false,
          define: false,
          requirejs: false
        },
        latedef: 'nofunc',
        nocomma: true,
        nonbsp: true,
        singleGroups: true,
        undef: true,
        unused: 'vars'
      },
      browser: browserPaths,
      node: {
        options: {
          node: true,
          browser: false
        },
        files: {
          src: nodePaths
        }
      },
    },
    jscs: {
      options: {
        fix: false, // Autofix code style violations when possible.
      },
      autoFix: {
        files: {
          src: jsPaths,
        },
        options: {
          fix: true,
          requireSpaceBeforeBinaryOperators: true,
          requireSpaceAfterBinaryOperators: true,
          requireSpacesInAnonymousFunctionExpression: {
            beforeOpeningRoundBrace: true,
            beforeOpeningCurlyBrace: true
          },
          requireSpaceBeforeBlockStatements: true,
          requireSpaceAfterComma: true,
          requireSpaceBetweenArguments: true,
          requireSpaceAfterKeywords: true,
          requirePaddingNewLinesAfterBlocks: true,
          requireLineFeedAtFileEnd: true,
          disallowTrailingWhitespace: true,
          requireSpaceBetweenArguments: true,
          validateQuoteMarks: true,
          requirePaddingNewLinesBeforeLineComments: true,
          disallowSpacesInCallExpression: true,
          disallowQuotedKeysInObjects: true,
          requireSpacesInsideObjectBrackets: 'all',
          disallowSpaceAfterObjectKeys: true,
          disallowMultipleLineBreaks: true,
          disallowSpacesInsideParentheses: true,
          disallowSpaceBeforeComma: true,
          disallowSpaceBeforeBinaryOperators: [','],
          requireSpaceBeforeObjectValues: true
        }
      },
      showErrors: {
        files: {
          src: jsPaths,
        },
        options: {
          preset: 'airbnb',
          maximumLineLength: false,
          requireTrailingComma: false
        }
      }
    },
    puglint: {
      views: {
        options: {
          preset: {
            disallowHtmlText: true,
            validateIndentation: 2,
            disallowDuplicateAttributes: true,
            disallowMultipleLineBreaks: true,
            disallowSpacesInsideAttributeBrackets: true,
            requireLowerCaseAttributes: true,
            requireLowerCaseTags: true,
            requireStrictEqualityOperators: true,
            validateDivTags: true
          }
        },
        src: jadePaths
      }
    },
    browserify: {
      messagingBundle: {
        src: ['src/messaging/main.jsx'],
        dest: './public/javascripts/messaging-bundle.js',
        options: {
          transform: ['babelify'],
          external: ['react', 'react-dom', 'redux', 'react-redux', 'react-thunk', 'babel-polyfill', 'isomorphic-fetch']
        }
      },
      calendarBundle: {
        src: ['src/calendar/main.js'],
        dest: './public/javascripts/calendar-bundle.js',
        options: {
          transform: ['babelify'],
          external: []
        }
      },
      smallCalBundle: {
        src: ['src/calendar/main-small.js'],
        dest: './public/javascripts/small-calendar-bundle.js',
        options: {
          transform: ['babelify'],
          external: []
        }
      },
      watch: {
        src: ['src/messaging/main.jsx'],
        dest: './public/javascripts/messaging-bundle.js',
        options: {
          transform: ['babelify'],
          external: ['react', 'react-dom', 'redux', 'react-redux', 'react-thunk'],
          watch: true,
          keepAlive: true
        }
      },
      watchCal: {
        src: ['src/calendar/main.js'],
        dest: './public/javascripts/calendar-bundle.js',
        options: {
          transform: ['babelify'],
          external: ['react', 'react-dom', 'redux', 'react-redux', 'react-thunk'],
          watch: true,
          keepAlive: true
        }
      },
      vendorReact: {
        src: [],
        dest: './public/javascripts/vendor-react.js',
        options: {
          require: ['react', 'react-dom', 'redux', 'redux-thunk', 'react-redux', 'isomorphic-fetch']
        }
      },
      vendorOther: {
        src: ['src/vendor/*.js*'],
        dest: './public/javascripts/vendor.js',
      },
    },
    uglify: {
      bundle: {
        files: {
          './public/javascripts/bundle.min.js': './public/javascripts/bundle.js',
        }
      },
      vendor: {
        files: {
          './public/javascripts/vendor-react.min.js': './public/javascripts/vendor-react.js'
        }
      }
    }
  });

  //register tasks:
  grunt.registerTask('default', ['jshint', 'jscs:autoFix', 'jscs:showErrors', 'puglint', 'eslint']);
  grunt.registerTask('lint', ['jshint', 'jscs:autoFix', 'jscs:showErrors', 'puglint', 'eslint']);
  grunt.registerTask('build', ['browserify:messagingBundle', 'browserify:calendarBundle', 'browserify:smallCalBundle', 'uglify:bundle']);
  grunt.registerTask('build-vendor', ['browserify:vendorReact', 'uglify:vendor']);
  grunt.registerTask('build-watch', ['browserify:watch']);
  grunt.registerTask('build-watch-cal', ['browserify:watchCal']);
};
