

/*

Templating:
    Primer - Handlebars

    Vseki fremework polzvanqkakuv templating.
    Angular, Meteor, React, vsichki polzvat nqkakuv template.

    Na izpita e pojelanie.
    I samo mojem da si napravim template

    Shte razgledame :
        01.Templating Consepts,
        02.Simple Templating
        03.Templating engines,
        04 Handlebars overview
        05.Examples


    Kakvo e template ?
        Tova e HTML shablon v otdelen fail, mojem da imame i promenlivi.
        Mojem da go preizpolzvame v mnogo razlichni failove.
        Kogato go promenqme go promenqme samo nego vednuj. 
        Shablona moje da sudurja i AJAX zaqvki kum baza.
        NE PRAVIM KOPY PASTE NA KOD.


    01.Templating Consepts:
        Template-a ima dinamichna i statichna chast:
        Statichnata chast e HTML.

        Dinamichnata chast sa zaqvkite kum daden backend i li baza primerno.
        Dinamichnata chast se durji otdelno.

        TEMPLATE ENGINE :
            Kombinira Statichnata i dinamichnata chast.

        
            Vidove templates:
                01.Pug - S edno kuchence e,
                02.Vue - Tova e po skoro gotov framework za frontEnd kato Angular i React,
                03.JQuery templates,
                04.UNDERSCORE.JS templates,
                05.Mustage,
                06.Handlebars
                
                Vseki edin ot teqh pishe malko po rzlichen HTML koito posle se kompilira 
                kum normalen HTML.


                Nai polzvanoto e Handlebars:
                    Bazirano e i na drugi biblioteki kato Mustagem, ima gotovi funkcionalnosti kato
                    funkcii promenlivi, ifove cikli i dr.
                

            INSTALLATION:
                01.npm install --save handlebars   //--save GO ZAPISVA V 'package.json' FAILA 
                    SUZDAVA NI node_modules PAPKA S pachage.json fail v neq
                POSLE ZA DA SI GO VKLUCHA V NQKOI HTML FAIL:
                <script>src=""</script>

                02.Mojem da polzvame i ONLINE CDN SCRIPT kakto sus JQUERY, OBACHE E NAI DOBRE I NASHIQ 
                    PROEKT DA IMA INSTALIRAN 'package.json'.
                https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.amd.js






                VAJNO !!!!!!!!!!!!!!!!!!!!!
                    01.SAMIQ HTML TEMPLATE ZA DA GO POLZVA HANDLEBARS TRQBVA DA Se kompiLira pUTVO. TOVA STAVA SUS
                        let template = Handlebars.compile(variableContainingTheHTML);
                    02.POSLE ZA DA PROMENI STOINOSTITE TRQBVA DA POLZVAME OBEKT:
                        //AKO ZBURKAME ILI PROPUSNEM NQKOI ELEMENT TOI SHTE BUDE PRAZEN ZA DA MOJEM DA GO VIDIM I DA GO OPRAVIM!!!!!
                        let context = {
                            title : "My New Post",
                            body : "This is my first post!"
                        };
                    03.PODAVAME OBEKTA NA template PROMENLIVATA:
                    let html = template(context);
                



                V Angular i drugi frameworci mojem da pishem primeron {{ 2 + 3 + 5}} I SHTE MI IZPISHE 10
                NO V Handlebars TOV ANE E POZVOLENO.

                FORLOOPS:
                    S Handlebars mojem da slagame for loopove v nashiq html kod kato promenqme
                    vsichko sus JavaScript.
                    VIJ FAILOVETE: loops.hbs, loopsExample.html                

                IF ELSE STATEMENTS:
                Sus Handlebars mojem da polzvame IFOVE ELSOVE I PROMENLIVI I DR.
                JIV FAILOVETE ifElseStatements.html, ifElseTemplate.hbs i ifElseTemplate2.hbs
                

                VAJNOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!
                    MOJEM DAPOLZVAME {{else}} I BEZ DA IMAME {{if}}
                    



        Partials:
            Tova sa templeiti koito mogat da se insertvat v drugi templeiti.
            Tova stava sus .RegisterPartial('template', source)
            VIJ FAILA partialInsert.hbs, partial.hbs i partialExample.html

        */
