module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    sass: {
      options: {
        outputStyle: 'expanded',
        sourceMap  : true
      },
      dist: {
        files: {
          'css/date-picker.css': 'scss/date-picker.scss',
          'app/css/app.css': 'app/scss/app.scss'
        }
      }
    },
    postcss: {
      options: {
        map: {
          inline: true
        },
        processors: [
          require('autoprefixer')({browsers: 'last 3 versions'})
        ]
      },
      dist: {
        src: 'css/**/*.css'
      }
    },
    watch: {
      css: {
        files: [
          'scss/**/*.scss',
          'app/scss/**/*.scss'
        ],
        tasks: ['build-css']
      }
    },
    html2js: {
      options: {
        base: 'html',
        module: 'kt.components.datePicker',
        singleModule: true,
        existingModule: true,
        rename: function (moduleName) {
          return 'kt-' + moduleName;
        }
      },
      main: {
        src: ['html/**/*.html'],
        dest: 'js/template/template-cache.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('build-css', ['sass', 'postcss']);
  grunt.registerTask('default', ['watch']);
};
