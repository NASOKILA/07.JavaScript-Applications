
/*

    Shte ragledame:
        01.Asyncromno programirane
        02.promises in JS - Concepts
        03.Promises with AJAX
        04.async & await
        05. .then()  .catch() na promise podavaiki funkciq


    Vajno e da mojem da gi polzvame na promisite, veche sme gi polzvamli.

    Asimhromno programirane:
        Zaqvkite NE  se izchakvat i koda si produljava, NE CHAKAME REZULTAT OT DADENA ZAQVKA
        ZA DA PRODULJIM S KODA NAPRED
        Nie mojem da pusnem primerno 5 funkcii navednuj, ako ctrqbva da chakame vsqka moje
        da ni otneme 10 sekundi i saita da ni blokira oprimerno, zatova 
        NE se izchakva responsa ot tezi zaqvki a koda si produljava naprd.
        
        MOJEM DA SLOJIM CALLBACK FUNKCIQ KOQTO DA SE IZPULNI SLED KATO POLUCHIM RESPONSE OT 
        ZAQVKATA.

        Vijdame kato otvorim brawsera pod Network pri zarejdane na dadena stranica
        kolko zqvki se izprashtat navednuj kum daden server i kolko milisekundi otnema vsqka edna.
        NQMA LOGIKA DA TRQBVA DA IZCHAKVAME VSQKA EDNA.


        Callback functon:
            Tova e funkciq koqto shte se izpulni sled zarejdaneto na dadena zqvka.


    Shte simulirame asinhromno programrane sus SetTimeout();


*/


setTimeout(task1, 500); //izpulnqva se sld 500 milisekundi
setTimeout(task2, 1000); //sled 1000
setTimeout(task3, 1500); //sled 1500

console.log('Tasks starting: ');
function task1() { console.log('Task 1 Started ...') }
function task2() { console.log('Task 2 Started ...') }
function task3() { console.log('Task 3 Started ...') }





/*

    Promisses:  .then()  &  .catch()
        Tova sa obekti koito durjat asinhromni operacii 
        Pravi se avtomatichno promise kogato imame asinhromna operaciq, kato zaqvka naprimer.

        Imame sustoqniq (states) na tezi Promisi koito mojem da manipulirame:
            01.Pending - Operaciqta vse oshte se izulnqva
            02.Fulfilled - Operaciqta e zavurshena i imame response
            03.Failed - Operaciqta se e provalila zaradi neshto, imame greshka

        ZAQVKITE AVTOMATICHNO SI PRAVAT PROMISE, MOJEM DA POLZVAME .then() ZA USPEH 
            i .catch() ZA GRESHKA
        
        SUS KLASA 'Promise' SI PRAVIM OBEKTI.

        SHTE IMITIRAME NQKKVI PROMISI ZASHTOTO NQMAME V MOMENTA BACKEND ZA REALNA STREDA V KOQTO DA GI PISHEM. 
*/

/*

let p = new Promise(function(resolve, reject){
    //ako se izpulni uspeshno vikame 'resolve' ako ne 'reject'

    if(uslovie)
        resolve('Success!');
    else
        reject('Failure!');

});

p.then(function(res){
    //VZIMAME REZULTATA I GO OBRABOTVAME TUKA
});

p.catch(function(err){
    //OBRABOTVAME GRESHKITE !!!
});

*/

console.log()
console.log('Before Promise !')
let p = new Promise(function (resolve, reject) {
    //ako se izpulni uspeshno vikame 'resolve' ako ne 'reject'

    setTimeout(function () {
        resolve('Success!');
    },3000); //Shte se izpulni sled 3 sekundi

});

p.then(function(res){
    //VZIMAME REZULTATA I GO OBRABOTVAME TUKA
    console.log(res);
});

console.log('After Promise !')


/*
    ASINHROMNITE OPERCII PRI IZPULNENIE SE SLAGAT V STEK,
    V KOITO VAJI SLEDNOTO: KOITO PURVI VLIZA TOI SE IZPULNQVA!
 */



/*Vajnoooooooooooooooooooooo!!!!!!!!!!!!!!!!111111

PONQKOGA ZA DA PRODULJIM NA PRED SHtE NI TRQBVA DADEN REZULTAT OT NQKUDE ILI NQKOLKO
RESULTATA.
    ZATOVA POLZVAME:  Promise.all([...])  KATO MU PODAVAME MASIV SUS ZAQVKI:

    Promise.all([p1, p2, p3]])
        .then(function(){
             ... 
        });

    Sus tova nie kazvame che kogato sa gotovi i trite zaqvki v masiva chak togava 
    da se izpulni koda v .then();


    VIJ promisesExample.js FAILA !




    Promises sus JQuery i AJAX :
        NQMA DA NI SE NALAGA DA PISHEM CHESTO PROMISI NA RABOTA NO E HUBAVO D GI ZNAEM.  





    Sus tova mojem da vzemem vseki komentar na koito post_id-to mu e ravna na podadenata ot na s promenliva 'id'
    url: URL + `comments/?query={"post_id":"${id}"}`






    Asiync & Await:
        Novi sa v JavaScript i ni ulesnqvat rabotata s 'Promises'
        Mojem da imame normalna funkciq i da napishem async otpred, tova shte q sloji zaduljitelno v promise.
        Tazi funkciq se prevrushta v 'promise' i mojem da i slojim .then() otpred.

        'Await' se slava vutre vuv funkciq koqto IMA 'Async' i se polzva za da NE izchakvame 
        dadeno neshto t.e. koda NE spira a si produljava i posle tam
        kudeto imame 'await' kato zaredi zaqvkata primerno si se izpulnqva.

        VIJ FAILA async&awaut.js

        Udobno e za polzvane za da ne si pravim primerno 'new Promise()' ...



        VAJNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        Ako ne rabotat async i awit v daden brawser polzvai BABBEL zashtoto prevejda nov JS kum star 




        Summary:
            01.Promises priema dva parametura 'resolve' i 'reject' : 
                new Promise(function(resolve, reject){...})mojem dagi obraborvame sus
                .then() i .catch()
            02.async & await sa novi i ni ulesnqvat rabotata s promesite, async pravi 
                normalna funkciq v promise, 'await' izchakva vutreshen 'promise' (zaqvka prmerno) i sled tova 
                koda produljava na dolo.    VIJ FAILA async&awaut.js  !!!




*/









