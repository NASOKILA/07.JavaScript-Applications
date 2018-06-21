
var loggingModule = {
    greet: function greet(){
        console.log('Logging from module')
    }
};

(function () {

    document.write('<h1>Hello, Grunt!</h1>');
    //izvikvame dunkciq ot drug fail
    loggingModule.greet();
    
})();




