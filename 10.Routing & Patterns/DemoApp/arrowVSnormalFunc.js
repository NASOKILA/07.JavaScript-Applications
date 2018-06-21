
let arrow = (ex) => {
    console.log('arrow');
    console.log(this);
    console.log(ex);
}

arrow('hahaha');


console.log()
console.log()
console.log()


function example(param)
{
    console.log(this);
    console.log(param);

}

example('hahaha');


