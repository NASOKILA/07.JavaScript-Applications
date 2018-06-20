




/*

    AJAX & JQUERY AJAX:

    Dnes shte pravim zaqvki s JavaScript vmesto s PostMan, 
    mojem pak po vsqko vreme da si go polzvame postman dori i na rabota !!!

    

    AJAX :
        Tova ni pomaga da si pishem zaqvkite.
        Ima gotov AJAX ZAKACHEN ZA JQUERY, mnogo lesno se polzva.

        Ajax shte go ima na izpita.

    
    Shte govorim za:
        01.Ajax,
        02.XMLHttpRequest - s tova mojem da pravim AJAX zaqvka BEZ JQuery. 
        03.AJAX sus JQuery - $.load   /   $.get()   /    $.post()     /    $.ajax()
            Oshte primeri s AJAX i Jquery, durpane ot Firebase baza.
        


    01.AJAX
        Asynchronous JavaScript And XML
        Tova e asinhromna tehnika za durpane na danni ot internet.
        ASYNHROMNO PROGRAMIRANE E SUS CALLBACK FUNKCII KOITO SE IZPULNQVAT KOGATO ZAQVKATA NI E 
        PRIKLUCHILA, VSICHKO TOVA STAWA BEZ DA SPIRA NASHIQ KOD.
        Nie prashtame zaqvka i si pravim callback funkciq v koqto vlizame samo kogato zaqvkata 
        ni e gotova.
        Celta na asinhromnostta e da se zaredi stranicata za usera po nai burziq nachin nezavisimo dali nqkoq 
        snimka primerno ne e zaredila.

        XML - tova e format samoche e po star i sega se polzva poveche JSON formata.


        Ima dva tipa AJAX:
            Tkuv koito arejda HTML i takuv koito raboti s JSON format.

        Na rabota shte polzvame ne JQUERY no nai veroqtno frameworci kato ANGULAR 4 koito si imat
        sobstven sintaxis za prashtane na zaqvki.

        VUV FACEBOOK PRIMERNO KATO SKROLVAME NADOLO SE ZAREJDAT ZQVKI I NIQ VIJDAME HTML-a
        TOVA NE E ZAREDENO PREDVARITELNO, ZAREJDA SE DOKATO SKROLVAME NADOLO.    



    02.XMLHttpRequest
        Pihem AJAX zaqvki s chist JavaScript:

        VAJNOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!
        VIJ ZADACHA 01.XHR (XmlHttpRequest){}

//Celta e da printiram na nakov repositoriqta v div s id 'res' !

    //Vzimame si requesta
    let req = new XMLHttpRequest(); //tova e klas 

    //zakachame mu onreadystatechange funkciq koqto shte se izpulni kogato state-a se promeni.
    //tova e kato onChange event.

    req.onreadystatechange = function(){    
        //kato napishem req.send() v tazi funkciq vlizame 4 puti
        //1 - za vruzka sus servera, 
        //2 - za poluchen request, 
        //3 - za obrabotvane na tozi request 
        //4 - kogato requesta e prikluchil i imame respons
        //steita moje da e mejdu 0 i 4, ako e chetiri znachi vsichko e prikluchilo i imame response ot zaqvkata
        if(this.readyState = 4 && this.status == 200) //znaem che statusa e 200 kogato vsichko e nared
        {
            //na elementa s id 'res' setvame texta ot responsa t.e. masiva ot JSON-i
            document.getElementById("res").textContent = this.responseText;

            //tuk znaem che 'this' sochi kum samiq request.
            //a responseText e tova koeto vrushta responsa
        }

    };

    //za da se promeni kakvoto i da e po tozi request toi trqbva purvo da se otvori.
    //kazvame kakva e zaqvkata i na koi adress, sus 'true' kazvame che e asinhromno 
    req.open("GET","https://api.github.com/users/testnakov/repos", true);
    
    //taka izprashta zaqvkata do adresa, promenq se steita i se izpulnqva gornata funkciqta !!!
    req.send();

}


             


    03.JQUERY AJAX:   
        Shte napravim sushtoto obache s JQuery
        Po lesen e sintaxisa otkolkoto samo s JS po ulesneno ni e vsichko 

        //.load() e vgradena funkciq na JQuery i zamenq sudurjanieto na nqkkuv element s novo 

        Mojem da zaredim html-a na celiq fail i da go slojim v nqkoi element.
        MOJEM NA .load() da mu podadem cql sait i shte mu zaredi celiq HTML

        ERROR HANDLING:
            $(...).ajaxError(function(event, req, settings){
                ...
            })
        Pri kakvato i da e greshkada stane se izpulnqva taq funkciq 

        MNOGO SAITOVE NE POZVOLQVAT DA IM TEGLISH SUDURJANIETO !!!!!!!
        Zashtoto ako imame sait na nqkakva banka nie mojem s edna zaqvka da i svalim
        celiq HTML i da si go slojim na nashiq sait i nqkoi da si napishe username i parola
        i da go ograbim.
        AKO OPITAME SHTE NI DADE GRESHKA OSHTE NA '0' t.e. OSHTE PRI ZAREJDANETO. 

        NE MOJEM DA SVALQME KAKVOTO SI ISKAME ZASHTOTO STAWAT MNOGO LESNO IZMAMI.




        

*/







