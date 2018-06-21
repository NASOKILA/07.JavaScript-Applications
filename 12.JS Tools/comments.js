
/*


    JS TOOLS AND LIBRARIES:

    TAZI LEKCIQ NQMA DA Q IMA NA IZPITA !!!

    Shte govorim za BUILD procesa na JavaScript, da JS se buildva !!!!!!!!!!!


    Shte govorim za:
        01.BUILD TOOLS - shte vidim dva po stari i edin po nov tool za buildvane na JS
        02.Lodash bibliotekata
        03.ESLint  -  instrument koito ni pomaga za pisane na po kachestven kod    
        04.Electron.js  -  Tova e biblioteka s koqto mojem da vzemem nashe prilojenie i 
            da go prevurnem v .exe fail i da gi izpratim na nqkoi. Sled tova nqmame nujda ot brawser
            za da si pusnem prilojenieto. 



    PROJECT WATERFALL Proccess:
        01.Write - pisane na koda 
        02.Lint - Tova e proverk na stila na pisane za daden programist
        03.Transpile - Prilojenieto da raboti na vsichki brawseri
        04.Bundle - subirame resursite i proekta v nqkkuv paket i gi izprashtame na potrebitelq. 
        05.Minify - Minificirame tozi bundle(paket) i go namalq kato premahva prazni mesta i drugi podobni raboti.
        06.Deploy - Deployvame  


    VAJNO!!!!!!!!!!!!!!!!!!!
        Kogato tugvame da deployvame stupkite ot 2 do 5 sa mnogo bavni
        i ako ni trqbva da deployvame po chesto shte trqbva da chakame
        Tuk idvat na pomosht BUIL IN TOOLS koito ni pomagat za deployvaneto 


    AGILE Proccess:
        Tam postoqnno deployvame.


    01.BUIL Tools
        Pomaganit za buildvaneto na nashiq proekt
        Podgotvq dadeni js failove
        poska nqkkvi unit testove
        i nakraq mojem da go nastroim da ni go deployva kum GIT ili drugo.

    
        TOOL TYPES:
            01.Grunt
            02.Gulp
            03.Webpack - Nai polzvano e, daje i v React.js, gornite dve sa po stari

            IMA KURSOVE V YOUTUBE SAMO ZA VEKI EDIN OT TEZI INSTRUMENTI


        Grunt:
            Instrument koito izvursha falovi operacii bazirani na konfiguraciqta koqto mu napravim.
            RAZCHITE NAI MNOGO NA DOBRA KONFIGURACIQ !!!!!!!!!!!!!!!
            PRAVIM MU KONFIGURACIONEN FAIL !!!
            Instalaciq:
                PURVO INSTALIRAME COMMANDLINE INTERPRETATORA
                    npm install grunt-cli -g        // TOVA E ZA DA INTERFEIS S KOITO IMAME DUMATA 'gulp' v terminala

                POSLE SAMIQ Grunt
                    npm install grunt --save-dev

                POSLE MOJE DA SE SVALQT I DOPULNITELNI PLUGINI !!!!
                    npm install grunt-contrib-concat --save-dev             //-dev otdelq svalenoto v papka specialno za developeri koqto ne dostiga do klienta
                    npm install grunt-contrib-uglify --save-dev
                    npm install grunt-eslint --save-dev



                Subirame mnogo failove v edin.

                IMAME FAIL ZA Rukovodstvo
                SLED VSICHKI KONFIGURACII SE PUSKA SAMO S DUMCHKATA 'grunt' V TERMINALA





        GULP:
            Suthoto e kato Grimp samoche e po lesno, leko i e po novo.
            Tuk razchitame na pisane na kod a ne na konfiguraciq.

            Instalaciqta e sushtata:
                npm install gulp-cli -g              //interfeisa za da imame dumichkata 'gulp' v konzolata
                npm install gulp --save-dev          //instalirame si go v proekta

            POSLE SI SVALQME I PLUGINITE.
                npm install gulp-contrib-concat --save-dev             //-dev otdelq svalenoto v papka specialno za developeri koqto ne dostiga do klienta
                npm install gulp-contrib-uglify --save-dev
                npm install gulp-eslint --save-dev


            //Gulpa vzima failove i gi prevrushta v edin stream koito da izprati na razlichni funkcii. 


        
        WEBPACK:
            prdishnite dva instrumenta si imat nedostatuci
            Grunt e dosta tejuk ot kum konfiguracii
            Gulp pak si ima nedostatuci

            Webpck e po nov i po predpochitan, polzvan e ot novite frameworci
            Izvurshava vsichite 6 stupki na vednuj kato poddurja dpendency managment
            Ima si sobstven server. Avtomatichno refreshva i seivva.

            Imame mnogo JS failove koito gi vzima i gi slaga v EDIN FAIL, 
            SUSHTOTO PRAVI I ZA CSS FAILOVETE.
            I POSLE VZIMA DVATA FAILA, JS I CSS I GI SLAGA V EDIN BUNDLE.

            Moje da dobavq i dopulnitelni neshta kato kartinki, ikonki, zvuci i dr koito gi pravi na 
            modul i da gi dobavq kum tozi BUNDLE. 
    

            INSTALACIQ:
                npm install webpack -g

            MOJEM DA SI INSTALIRAME DOPULNITELEN SERVER KOITO NE E ZADULJITELEN NO E PREPORUCHITELEN.
                npm install webpack-dev-server -g
                TOI SE PUSKA SUS :
                    webpack-dev-server


            KAK DA GO PUSNEM ?
                webpack ./app.js bundle.js      //posochvame nachalniq fail i krainiq fail i to si pravi vsichko samo.

            Mojem da si napravim i nasha si konfiguraciq sus:
                kato si napravim webpack.cofig.js      i da si mu opishem kakvo da pravi


            WEBPACK IMA EDNO NESHTO KOETO SE NARICHA 'WATCH' TO GLEDA ZA PROMENI I NI RELOADVA VSICHKO.  


*/






