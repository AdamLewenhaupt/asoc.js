module.exports = (grunt) ->

	grunt.initConfig

		pkg: grunt.file.readJSON 'package.json'

		coffee:
			compile:
				files:
					'out/asoc.js': 'src/asoc.coffee'

		watch:
			scripts:
				files: ['src/*']
				tasks: ['coffee']
				options:
					interrupt: true


	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask('default', ['watch'])

