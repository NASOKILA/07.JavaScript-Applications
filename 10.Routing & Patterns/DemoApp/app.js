

//KOGATO SE ZAREDI CQLIQ APLIKACIQ
//TRQBVA NI ARROW FUNKCIQ ZA START AKO SME RESHILI DA PRAVIM Sammy.js APP
$(() => {
    "use strict";

    //Pravim si sammy applikaciq i q zapazvame v konstanta
    //kazvame v koi fail da zarejda rezultata. I si pravim funkciq ili ARROW funkciq s parametur !!!
    const sammyApp = Sammy('#main', function(){
        //purviq parametur e kude iskame da slojim celiq kontent
        //Ako imame ARROW funkciq this-a se promenq i promenq neshtata v sammy.js !!!

        //opisvame putq i slagame arrow funkciq koqto priema parametur CONTEXT
        this.get('#/index', (ctx) => { 
            //Sega kato pusnem prilojenieto na stranica #/index.html shte se poqvi slednoto:
            ctx.swap('<h1>Home Page</h1>')
            //sus ctx.swap(...) mu kazvame kakvo da se pokaje.
        });


        this.get('#/about', function(){
            //Tuk go pravim s normalna funkciq i nqmame kontext zastova polzvame 'this'
            //Razlikata mejdu normalnata i ARROW funkciqta e che vmesto 'this' trqbva da podadem parametur (arg) => {...} 
            this.swap('<h1>About Page</h1>');
        });

        //Mojem da go napravim i po sledniq nachin.
        //Purvo pishem METODA, posle ROUTA i posle chak FUNKCIQTA
        this.route('get', '#/contact', (ctx) => {
            //Mojem da imame i 'GET', 'PUT', 'POST', 'DELETE',
            ctx.swap('<h1>Contact Page</h1>');
        })

        //Ako shte vzimame neshto ot linka ni trqbva ':'
        this.get('#/book/:bookId', function(){

            //vzimame si ID-to ako iskame
            let bookId = this.params.bookId;

            //mojem da vzemem putq
            let path = this.path;

            console.log(bookId);
            console.log(path);
            console.log(this);

            this.swap(`<h1>Book ${bookId}</h1>`);
        })


        //pravim si get za 'login' koito da ni vrushta dadena formichka
        this.get('#/login', (ctx) => {
          
            //Slagame si cqlata formicha
            //ZADULJITELNO NI TRQBVA METODA DA E 'post' , AKO E 'get' VSICHO OTIVA KUM URL-a!!! 
            ctx.swap(`<form action="#/login" method="post">
            User: <input name="user" type="text">
            Pass: <input name="pass" type="password">
            <input type="submit" value="Login">
            </form>`);
        })


        //Pravim si POST zaqvkata za LOGIN FORMATA !!!
        this.post('#/login', (ctx) => {

            //VINAGI TRQBVA DA GLEDAME METODA I ACTIONA NA DADENA FORMA !!!
            //vzimame si usera i parolata, VINAGI PO 'name' ATRIBUTA
            console.log(ctx.params.user);
            console.log(ctx.params.pass);

            //sled kato se lognem mojem da iskame da redirektnem usera na nqkude.
            //Tova stawa sus : 
            ctx.redirect('#/index');

        })


        //KOMBINIRANE NA Handlebars.js TEMPLEITI V Sammy.js :
        //Trqbva purvo da imame pugina slojen v index.html faila, PLUGNA SI IDVA SUS Sammy.js
        //posle si vzimame Handlebars.
        this.use('Handlebars', 'hbs'); //extentiona e vtoriq parametur

        this.get('#/hello/:name', function(){

            //Trqbva da gi zakachim dinamichno dannite koito iskame za templeita
            this.title = 'Hello!';
            this.name = this.params.name;


            //zarejdane na partial templeiti:
            //TOVA RABOTI ASINHROMNO I VRUSHTA PROMISE, ZNACHI MOJEM DA POLZVAME .then() i .catch()
            this.loadPartials({
                header : './templates/common/header.hbs',
                footer :  './templates/common/footer.hbs',
            }).then(function(res){
                //celta e da zaredim i glavniq template
                this.partial('/DemoApp/templates/greeting.hbs');

            }).catch(function(err){
                console.log(err);
            })

            //PISHEM SLEDNOTO AKO NQMAME PARTIAL TEMPLEITVANE:
            //this.partial('/DemoApp/templates/greeting.hbs'); //otivame do templeita koito iskame da polzvame
        })        
    }) 


    //Puskame si applikaciqta ZADULJITELNO.
    sammyApp.run();

})




