




let p1 = new Promise(function(resolve, reject){
    console.log('p1 started ...');

    setTimeout(function(){
        resolve('p1 result !');
    }, 1000);

    console.log('p1 finished !');
});

let p2 = new Promise(function(resolve, reject){
    console.log('p2 started ...');

    setTimeout(function(){
        resolve('p2 result !');
    },1500);

        console.log('p2 finished !');
});

let p3 = new Promise(function(resolve, reject){
    console.log('p3 started ...');

    setTimeout(function(){
        resolve('p3 result !')
    },2000);

    console.log('p3 finished !');    
});


Promise.all([p1, p2, p3])
    .then(function(res){
        console.log('All three promises are handled !')
    
        console.log(res.join(' / '));
    })
    .catch(function(err){
        //AKO NQKOI PROMICE E VHURLIJ ERROR V reject IDVAME TUKA.
        console.log('There was an Error !')
        console.log(err)
    });













    