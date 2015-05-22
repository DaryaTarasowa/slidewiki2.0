module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
			dist: {
				src: ['build/*', '!build/bower_components/**']
			}
		},
        concurrent: {
            dev: ['nodemon:dev', 'webpack:dev'],
            options: {
                logConcurrentOutput: true
            }
        },
		concat: {
			dist: {
				src: ['./src/assets/css/*'],
				dest: 'build/css/bundle.css',
			},
		},
		cssmin: {
			dist: {
				src: ['build/css/bundle.css'],
				dest: 'build/css/bundle.min.css',
			},
		},			
        copy: {
			js: {
				cwd: './src/assets/js/',  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: 'build/js',    // destination folder
				expand: true           // required when using cwd
			},
			themes: {
			    cwd: './src/assets/themes/',  // set working folder
				src: '**/*',           // copy all files and subfolders
				dest: 'build/css/themes',    // destination folder
				expand: true           // required when using cwd
			}
		},
        nodemon: {
            dev: {
                script: './src/server.js',
                options: {
                    ignore: ['build/**'],
                    ext: 'js,jsx'
                }
            }
        },
        webpack: {
            dev: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './src/client.js',
                output: {
                    path: 'build/js',
                    filename: 'bundle.js'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.jsx$/, loader: 'jsx-loader' }
                    ]
                },
                stats: {
                    colors: true
                },
                devtool: 'source-map',
                watch: true,
                keepalive: true
            }
        }
    });


    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean:dist', 'copy:js',  'copy:themes', 'concat', 'concurrent:dev']);
    
};
