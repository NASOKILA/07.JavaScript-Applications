
async function test() {

    console.log('Start ...')

    await new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Success !');
        }, 2000);
    }).then(function (res) {
        console.log(res);
    })

    return 'End ...';
}

test().then(function (res) {
    console.log(res)
})
    .catch(function (err) {
        console.log('ERRORRR !')
        console.log(err);
    })