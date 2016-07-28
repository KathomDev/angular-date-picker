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
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build-css', ['sass', 'postcss']);
  grunt.registerTask('default', ['watch']);
};
