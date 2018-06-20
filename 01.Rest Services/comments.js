

/*


Nqma da pishem kod dnes a samo shte rabotim s PostMan, REST i http

Shte polzvame Kinvey i Firebase za rabota s bazi 


Shte razgledame:
    01.HTTP protocol,
    02.HTTP Developer tools  -  kak da debugvame http, kak da s i sledim zaqvkite i dr
    03.Kakvo e REST i RESTfull Services
    04.Rabota s Github API
    05.Firebase
    06.Kinvey




    01.HTTP protocol (Hyper Text Transfer Protocol)
        Tova e vruzka mejdu servera i klienta,
        Klienta izprashta HTTP Request kum (zaqvka) servera i toi mu otgovarq s 
        HTTP Response !!!!!!!!!!!!

        HTTP Protokola opredelq pravilata

        Vidove zaqvki:
            GET: Samo vzimame neshto bez da izprashtame, NQMA BODY
            POST: Izprashtame suzdavame neshto, IMA BODY 
            PUT: Updeitvane na resuts OBACHE NA CELIQ RESURS
            DELETE: Zaqvka za triene na resurs
            PATCH: ZA UPDEITVANE NA CHAST OT RESURS, NE NA CELIQ RESURS 
            HEAD: Ako iskame da vzemem samo Headerite na reponsa a ne celiq HTML, NE SE POLZVA MNOGO 

        
            IMA OSTA MNOGO VIDIVE ZAQVKI
        
        //Mojem da polzvame samo purvite 5 !!!!!!!!!!!


        HTTPS  -  E SIGUREN PROTOKOL, POLZVA SE ZA BANKI I PO SERIOZNI SAITPVE. 
        's' nakraq oznachava 'secure'



        Issues:
            Ako imame proekt v github koito da e open sourse, moje nqkoi da go polzva za
            neshto, ako obache tozi chovek nameri nqkakuv problem moje da ti otvori 
            'issue' v proekta i da obiche buga koito e nameril.  

            GET zaqvkite NQMAT Body
            POST zaqvkite imat BOTY: BODITO E V JSON FORMAT

            <CRLF>
                {
                    ... : ...
                    ... : ...
                }
            <CRLF>

            
            Sled podadena zaqvka survera kum koit sme q izpratili otgovarq sus RESPONSE:
            
            Successful request:
                200 OK         //survera vrushta tova kogato vsichko e minalo uspeshno
                vrushta i oshte informaciq za RESPONSA 
            
        VAJNOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!
        Status kodove:   KODOVE KOITO SERVERA VRUSHTA NA NAS:
                
            Status Code   /   Action   /   Description
            200              OK            - Successfully recieved resourse   
            201              Created       - New Resourse Created
            204              No Content    - Request has nothing to return
            301 / 302        Moved         - Moved (Redirected) to another location
            400              Bad Request   - Invalid Request Syntax error
            401 / 403        Unauthorized  - Authentication failed / Access Denied
            404              Not Found     - Invalid resource
            409              Conflict      - Conflict was detected, example: duplicated email
            500 / 503        Server Error  - Internal Server Error, Service unavalible

            IMA OSHTE MNOGO VIDOVE RESPONSI NA SERVERA OBACHE ZA SEGA TEZI SA DOSTATUCHNI.

            Tezi koito zapochvat s:
            200  -  sa minali uspeshno, dori i da pravqt razlichni neshta
            300  -  Znachi neshto e premesteno i li redirektnato
            400  -  Znachi neshto ne e minalo uspehno, ima greshka obache tq e 
                po vina na tozi koito e izpratil zaqvkata !!!!!!!!!!!
            500  -  Tova veche sa greshki vuzniknali na servera obache ne po 
                nasha vina a na samiq server !!!!!!!


            POVECHETO REQUESTI SE POLUCHAVAT V JSON FORMAT.






    02.Developer Tools
        Google Chrome Developer Tools
        POSTMAN, 
        Fiddler - Web Debugger,
        
                
        Google Chrome Developer Tools:
            Ako dadem F12 i otidem na Network ot tam mojem da si sledim vsichki napraveni zaqvki
            sus cqlata informaciq za tqh.
            POLEZNO E ZASHTOTO MOJEM DA SI GLEDAME KOI ZAQVKI MINAVAT I KOI NE DOKATO SI PRAVIM NASHIQ SAIT.

            SHTE GO POLZVAME DOSTA V TOQ KURS.

            Vseki suvremenen brawser bi trqbvalo da moje da pokazva informaciq na 
            programista za zaqvkite 
    

        Fiddler - e pak za sledqne na zaqvki mojem da si go instalirame, ima i nqkakvi extri.
            

        PostMan:
            Mojem da go instalirame, mojem i d go vkluchim kum brawsera




    03.RESTFULL SERVICES: (Representation State Transfer)
        Tova e backenda na nashero prilojenie, lusha na nqkakuv aderes i ni vrushta reponse.
            
        Tova e server, moje da se pravi sus node.js i vurhu nego instalrano expressJs.
        Taka se vdiga celiq APPICATION.
        RESTFULL SERVICA SLUSHA ZA ZAQVKA IMA (req, res) KOETO E REQUIEST I RESPONSE.
            

            API - Application Programming Interface
                Tova e neshto koeto ni se predostavq na gotovo za da polzvame GitHub
                chrez primerno POSTMAN, mojem da mu prashtame zaqvki i to shte ni vrushta otgovori.

            VAJNO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                GitHub ni predostavq gotov REST API koito mojem da dostupim s http protokol
                i mojem da prashtame vsqkakvi zaqvki kum nego.

            VAJNO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                Ako poveche ot 100 choveka prashtame edna i suhta zaqvka kum GitHub te go priemat kato hakerska ataka
                i ne ni vrushta tova koeto iskame

            VAJNO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                Za da prashtame POST zaqvki kum GitHub repositoriq Chrez POSTMAN 
                trqbva da se lognem:
                    V POSTMAN otivame na Authorization i selektirame Basic Auth, sled koeto 
                    si pushem username i password za da se lognem i da izpratim dadena POST zaqvka
                    I cukvame na Update Request.
                    
                    Kato pravim body na post zaqvka cukame na 'raw' koeto oznachava chist JSON format
    

    05.Firebase & Kinvey
        Te predstavlqvat cql backend + baza danni
        Shte mojem da storvame kakvoto si iskame v tazi baza pod JSON format.
        Zatova e 'jason-based'
        Te ni predostavqt gotova baza i backend kum koito mojem da izprashtame zaqvki
        Po princip Firebase se plashta za da si skladirat horata dannite na prilojeniqta
                no mojem da polzvame bezplatno Firebase samo za praktika.
        
        Suzdavame si proekt ot Firebase izbirame si durjavata v koqto sme, tova e vajno za serverite.
        Kato zaredi otivame na gore ot lqvo na DEVELOP i posle na 'Database'
        sled koeto mojem da si suzdadem nasha baza i chrez '+' da si dobavqme tablici.
        Moje i ot frontEnda na nasheto prilojenie da se dobavqt danni v bazata, primetno ako nqkoi 
        potrebitel postne neshto v nashiq sait.
        Sled kato si dobavim tablicite s dannite mojem da polzvame POSTMAN za da izprashtame zaqvki.
                
        TRQBVA DA SI OPRAVIM AUTENTIACIQTA NA BAZATA: Kato otidm na 'Database' Rules i setnem vsichko na 'true';
           Pravim go za da ne e nujno da se autentikirame kato praktikuvame obache ako e realen proekt
           ZADULJITELNO NI TRQBVA AUTENTIKACIQ INACHE NQKOI MOJE PROSTO DA VLEZN I DA NI IZTRIE VSICHKO OT BAZATA.
            {
                "rules":{
                    ".read": "true",
                    ".write": "true"
                }
            }

        Za da vzimame ot Firebase baza trqbva nakraq na GET zaqvkata da slagame .json
        Kato dobavim neshto kum Firebase bazata chrez POSTMAN ni suzdava avtomatichno nqkakvo ID.

        VAJNOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!
            
        PATCH zaqvkata promenq dadeno neshto po bazata, NO NE CELIQ OBEKT.
            I ako nqma daden kluch ni go dobavq s negovata stoinost.
            Trqbva da mu dadem i Id.
        
        DELETE:
            Triem ot bazata crez POSTMAN s posochenoto ID
            Ako iztriem neshto uspeshno shte ni vurne 'null'.
            Mojem da triem i kluch na daden post s dadeno Id

        PUT:
            PROMENQ CELIQ OBEKT S TOVA KOETO MU PODADEM KATO KLUCH I STOINOST
            Mojem pak da promenqme neshto ot bazata obache ne kato dobavqme ili mahame kluchove i stoinosti
            a kato gi promenqme samite teh.
            PROSTO SLED Id-to TRQBVA DA SELEKTIRAME KAKVO ISKAME DA PROMENIM.
            Mojem da promenim samo edno pole kato go opishem i mu podadem nqkkuv string.





    KINVEY:
        Sushtoto e kato FireBase no se polzva i za mobilni ustroistva (mBaas).
        Pak predostavq nqkkuv backend Service.
        Otivame v saita na Kinvey: 
            www.kinvey.com
        01.Pravim si regitraciq
        02.Pravim si nov proekt

        Malko po razlichno e ot FireBase
        Za da pravim GET zaqvki ni trqbva AppID-to koeto e AppKey na nasheto prilojenie
        PRIMER:
            https://baas.kinvey.com/appdata/{appId}/posts
            BEZ .json NAKRAQ tova beshe samo za Firebase

        ZA ZAQVKITE TRQBVA DA SI PISHEM AUTENTIKACIQTA ZA DA VLEZEM.
        POST:
            Za da postnem zaqvka ni trqbva da dobavim v PotMan pri HEADERS da dobavim nov HEADER.
            Content-Type  =  application/json
        
        DELETE:
            Trie se taka:
                https://baas.kinvey.com/appdata/{appId}/posts/{postId}

        VAJNOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            Trqbva da se logvame zaduljitelno

        VAJNOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            Mojem da se logvame i chrez POST zaqvka kato podadem JSON format username i password:
                SETVAME V AUTHORIZATION NA 'No Auth' 
                https://baas.kinvey.com/user/{appId}/login
                
                v bodyto trqbva da imame:
                {
                    "username":"guest",
                    "password":"guest",
                }
            I TAKA SE LOGVAME KATO NI DAVA BISKVITKA

        LOGOUT:
            Trqbva ni tazi biskvitka za da se logoutnem, pihem q v AUTENTICATION
            
            Pak stava s POST zaqvka na 
            https://baas.kinvey.com/user/{appId}/_logout

            VAJNO E DA IMA DOLNA CHERTA PREDI logout
            Ako sme se razlognali pravilno ni vrushta prazno, t.e. nishto.




        Summary:
            01.RESTFULL SERVICE SLUSAH NA DADEN ADRES I PREDLAGA CRUD OPERACII.
                Vidqhme Firebase, Kinvey i GitHub go imat tova veche gotovo 
            02.HTTP i HTTPS sa protokoli samoche vtoroto e encripted.
            03.Zaqvkite sa GET, POST, PUT, PATCH, DELETE i dr. no tezi sa nai vajnite
            04. Vidqhme i POSTMAN kak raboti.

*/















