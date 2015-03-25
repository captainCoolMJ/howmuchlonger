module.exports = function( grunt ) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		watch: {
			express: {
				files: ["./**/*.js"],
				tasks: ["express:dev"],
				options: {
					spawn: false,
					livereload: true
				}
			},
			livereload: {
				files: ["_public/**/*.css", "_public/**/*.html"]
			},
			options: {
				livereload: true
			}
		},

		compass: {
			dist: {
				options: {
					config: 'config.rb',
					watch: true
				}
			}
		},

		express: {
			options: {
				port: 8080
			},
			dev: {
				options: {
					script: "server.js"
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-express-server");

	grunt.registerTask("serve", ["express:dev", "watch", "compass"]);

};