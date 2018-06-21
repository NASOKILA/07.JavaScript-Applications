
/*
    Shte polzvame templating i routing za da si napravim Single Page App.

    Shte govorim i za:
        01.Routiung,
        02.Sammy.js,
        03.Design patterns,
        04.JS Disain patterns

    Shte napravim Demo za svurzane na routing i templating
    Shte polzvame bibliotekata Sammy.js vmesto HandleBars. 


    Nakraq shte imame edin fail koito shte se zanimava samo sus zaqvkite,
    edin servise koito da se zanimava sus autentikaciq.


    01.Routing:
        Routinga ni pozvolqva navigaciq bez da prezarejdame stranici.
        Kakto e v Single Page Applikaciite !
        Routera raboti sus templeitite i gi zamestva.
        Applikaciite koti polzvat Routing sa po dobri kato performance.
        Mojem da polzvame istoriqta nna samiq browser.

    02.Sammy.js:
        Ima si JQuery vgradeno v nego, to go polzva.
        Zatova za da polzvame Sammy.js purvo trqbva da imame JQuery instalirano.
        Kogato edna biblioteka zavisi ot druga tova se naricha DEPENDENCY.
        Sammy.js raboti i sus HANDLEBARS, to e plugin.
        Instalacq na Sammy.js:
            npm install --save sammy
            PRAVIM SI : package.json 
            Vseki proekt trqbva da si ima package.json za da mojem da instalirame biblioteki lokalno v proekta.
            KOGATO INSTALIRAME BIBLIOTEKA SHTE Q VIDIM TAM.
            INSTALIRAME SI :
                npm install --save jquery
                npm install --save handlebars
                npm install --save sammy
                
        KAto go vkluchvame v html purvo si vkluchvame JQUERY i HANDLEBARS:
            <script src="/node_modules/jquery/dist/jquery.min.js"></script>
            <script src="/node_modules/handlebars/dist/handlebars.min.js"></script>
            <script src="/node_modules/sammy/lib/sammy.js"></script>

        ZA DA TRUGNE HANDLEBARS KUM SAMMY.JS SHTE NI TRQBVA HANDLEBARS PLUGIN.


        KAK RABOTI Sammy.js
            Polzva se '#' za lokaciqta:
                <a href="#/index.html">Home</a>
                <a href="#/about">About</a>
                <a href="#/contact">Contact</a>

            Za vseki link mojem da si generirame daden HTML ili TEMPLATE s HTML
            i da go pokazvame.
            Dannite se keshirat v brawsera i izbegvame prezarejdaneto na danni.
            Dannite zarejdat vednuj i tova e.

            Primer:
                V papka DemoApp vij index.html i app.js i SHTE VIDISH KOLKO E LESNO.
                const sammyApp = Sammy('#main', function(){ ... }

   
    
    
            VAJNOOOOOO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                MOJEM DA IMAME MNOGO SAMMY.JS APPLIKACII V EDIN FAIL.


            VAJNOOOOOO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                NESHTA KOITO VZIMAME OT URL-a SE PISHAT SUS ':' !!!!
                V papka DemoApp vij index.html i app.js login formata


            Sammy.js Mnogo prilicha na Express.js

            VAJNOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!
                REDIREKTVANETO STAVA SUS :
                    this.redirect('pathToRedirect');
        


        KAK RABOTI S HANDLEBARS ?
            01.TRQBVA PURVO DA IMAME Handlebars v index.html I POSLE DA
                SLOJIM SAMMY.JS I POSLE CHAK SLAGAME PLUGINA OT KOITO SAMMY IMA NUJDA !!!!!
                V papka DemoApp vij index.html i app.js
            02.Trqbva da kajem na Sammy.js da polzva HandleBars.
                this.use('Handlebars', 'hbs'); //extentiona e vtoriq parametur

            03.Posle si polzvame templeita taka:
                 this.get('#/hello/:name', function(){
                    //Trqbva da gi zakachim dinamichno dannite koito iskame za templeita
                    this.title = 'Hello!';
                    this.name = this.params.name;
                    this.partial('/DemoApp/templates/greeting.hbs'); //otivame do templeita koito iskame da polzvame
                })    

            VAJNOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                MOJEM DA LISTVAME MNOGO TEMPLEITI VUV EDIN ROUTE !!!!!!!!!!!
                
            PARTIAL TEMPLEITI:
                KAK DA POLZVAME PARTIAL TEMPLEITI (Templeiti v templeiti) V SAMMY.JS
                Sammy.js TURSI TEMPLEITITE V CATCHE PAMETTA NA BRAWSERA.



        DISAIGN PATTERNS:
            Primerno MVC !!!!!!
            Kak da si refaktorirame koda za da se polzva po dobre.
            Celata e da pishem koda si po lesnoi toi da e organiziran.
            Hubavo e da si delim koda na razlichni faillove i funkcii.

            VAJNOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!
            Kak da si strukturirame proekta ?
                01.Main script - fail koit oda puska applikaciqta, kato app.js
                02.Requester(remote API) - prashta zaqvki kum baza
                03.Autentikator - zanimava se samo s Login, logout i register zaqvki
                04.Router - Znaem kakvo e 
                05.View Controllers - Durjim si funkciite koito sa za preprashtane i smenqne na view-tata.
                    Ne e zaduljitelno da imame takiva.
            
            Hubavo e da imame papka JS za vsichki Javascript failove
            i papka templates za vsichki templeiti

            VAJNOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            Moje daimame i authService.js fail v 'js' papkata koito e service
            zanimavasht se samo s Login, Logout, i Register
            VUTRE TRQBVA DA IMAME I FUNKCIQ  saveSession(){...} koqto da zapazva 
            authentikaciq, user i id.
            I clearSession funkciq koqto da iztriva vsichko ot localStorage

            VAJNOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            TRQBVA NI I FUNCKCIQ KOQTO DA PROVERQVA DALI SME AUTENTIKIRANI ILI NE
            TQ VRUSHTA TRUE ILI FALSE DALI 'authentication tokena sushtestvuva ili ne' 
            function IsAuth(){...}


            VAJNOOOOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            Pri registraciq logvane i logoutvane modula e vinagi 'user'
            pri drugite e 'appdata' !!!!



            TEMPLEITI:
                Pravim si template papka za templeiti i v neq si pravim papka
                'common' koqto e za vsichki obshti templeiti.

            KATO SI NALEEM VSICHKI TEMPLEITI VUV OTDELNI FAILOVE.
            SI OSTAVQME V 'body' - to EDIN DIV S id="main" !!!!!


            Purvo zarejdame welcome stranicata.

            KAK SE ZAREJDAT PARTIAL TEMPLEITITE ? 
                
            //zarejdame si partianite templeiti i gi slagame v glavniq sus .then(...)
                ctx.loadPartials({
                    header : '/Skeleton/templates/common/headerPartial.hbs',
                    footer : '/Skeleton/templates/common/footerPartial.hbs',
                    loginForm : '/Skeleton/templates/forms/loginForm.hbs',
                    contactPage : '/Skeleton/templates/contacts/contactPage.hbs',                
                }) 
                .then(function(){
                    this.partial('./templates/welcome.hbs');
                })


        Summary:
            01.Handlebars.js e templating Engine
            02.Sammy.js e routing framework koito ni suzdava routing na single page applikaciqta
                Handlebars i sammy.js ne se polzvat mnogo v praktikata ot programisti,
                ima si frameworci kato angulatr i react koito s gi imat vgradeni.
            03.Partial templeiti sa templeiti v templeiti
            04.Purvo se instalira Jquery, Handlebars.js, Sammy.js, posle 
                plugina na sammy za rabota s handebars
                i nakraq 'app.js' faila za startirane na prillojenieto zashtoto to moje da gi polzva vsichki
                tezi biblioteki 



*/ 


