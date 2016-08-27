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
        esversion: 5,
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
      bundle: {
        src: ['src/**/main*.js*', 'src/misc/*.js'],
        dest: './public/javascripts/bundle.js',
        options: {
          transform: ['babelify'],
          external: ['react', 'react-dom', 'redux']
        }
      },
      watch: {
        src: ['src/**/main*.js*', 'src/misc/*.js'],
        dest: './public/javascripts/bundle.js',
        options: {
          transform: ['babelify'],
          external: ['react', 'react-dom', 'redux'],
          watch: true,
          keepAlive: true
        }
      },
      vendorReact: {
        src: [],
        dest: './public/javascripts/vendor-react.js',
        options: {
          require: ['react','react-dom','redux']
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
  grunt.registerTask('build', ['browserify:bundle','uglify:bundle']);
  grunt.registerTask('build-vendor', ['browserify:vendorReact','browserify:vendorOther','uglify:vendor']);
  grunt.registerTask('build-watch', ['browserify:watch']);
};
