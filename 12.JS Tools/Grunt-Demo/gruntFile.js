

module.exports = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: ['js/module.js', 'js/app.js',],
                dest: 'build/bundle.js',//vzima gornite dva faila i gi slaga v tozi
            },
        },
        uglify: {
            build: {
                src: ['build/bundle.js'],
                dest: 'build/bundle.min.js'//vzima gorniteopisani failove i gi slaga v tozi
            }
        },
	eslint: {
    	    options: {
      	        configFile: '.eslintrc.json',
            },
            target: ['js/app.js', 'js/module.js',]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');    
    grunt.loadNpmTasks('grunt-contrib-uglify');    
    grunt.loadNpmTasks('grunt-eslint');    

    grunt.registerTask('default', ['concat', 'uglify']);    

}