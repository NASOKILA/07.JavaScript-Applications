


async function test(){

   // throw new Error('Hello Error !');
   
    console.log('Start ...')

    //ZA DA POKAJEM AWAIT NI TRQBVA PROMISE KOITO DA SIMULIRA NQKAKVA ASINHROMNA ZAQVKA
    await new Promise(function(resolve, reject){

        //kazvame mu sled dve sekundi da resolvne 'Success !'
        setTimeout(function(){
            resolve('Success !');
        },2000);

    }).then(function(res){
        console.log(res); //printirame 'Success !'
    })

    //SLED KATO PRIKLUCHI GORNOTO CHAK TOGAVA IDVAME TUKA I VRUSHTAME 'End ...' !!!
    //AKO MAHNEM 'await' SHTE PRINTIRA 'End ...' I POSLE 'Success !'
    return 'End ...';
}

test().then(function(res){
    //sled kato ima 'async' to stava na 'Promise' i mojem da mu zakachame .then() i .catch()
    console.log(res)
})
.catch(function(err){
    console.log('ERRORRR !') //ako imame greshka vlizame tuka
    console.log(err);
})


//AKO MAHNEM 'await' SHTE PRINTIRA 'End ...' I POSLE 'Success !'
//ZASHTOTO NQMA DA IZCHAKA VUTRESHNIQ PROMISE,
//async PREVRUSHTA NORMALNA FUNKCIQ V Promise I AKO ISKAME DA POLZVAME 'await' V DADEN PROMISE
//NI TRQBVA 'async' OTPRED.




