
function attachEvents() {

    const URL = 'https://baas.kinvey.com/appdata/kid_BJKFMbN9z/';

    //TUK SHTE DURPAME OT KINVEY BAZA I NI TRQBVA AUTENTIKACIQ.
    //TRQBVA NI IME I PAROLA ZA VECHE DOBAVEN USER ZA DA VLEzEM
    const USERNAME = 'Peter';
    const PASSWORD = 'ppp';

    //TRQBVA DA KESHIRAME USERNAME i PAROLATA PO SPECIQLEN NACHIN ZA KINVEY-to SUS BASE64.
    //vij saita : www.base64.org 
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);

    //PRAVIM SI SPECIALNIQ OBEKT KOITO SE OCHAKVA OT KENVEY I GO PODAVAME NA ZAQVKATA S KLUCH 'headers':
    const AUTH = { 'Authorization': 'Basic ' + BASE_64 };

    $('#btnLoadPosts').click(function () {

        $.ajax({
            method: 'GET',
            headers: AUTH,
            url: URL + 'posts'
        })
            .then(function (res) {

                $('#posts').empty();

                for (let key in res) {

                    let post = res[key];
                    let id = post._id;

                    let option = $(`<option value="${id}">${post.title}</option>`);

                    $('#posts').append(option);
                }
            })
            .catch(function (err) {
                console.log(err)
            });

    });


    $('#btnViewPost').click(function () {

        let selectedOption = $('#posts > option:selected')[0];
        let id = selectedOption.value;

        //Post 1
        $.ajax({

            method: 'GET',
            headers: AUTH,
            url: URL + 'posts/' + id
        })
            .then(function (res) {

                let title = res.title;
                let body = res.body;

                /*
                $('#post-title').text(title);
                $('#post-body').text(body);
                */

                //comments
                $.ajax({
                    method: 'GET',
                    headers: AUTH,
                    url: URL + `comments/?query={"post_id":"${id}"}`
                })
                    .then(function (res) {

                        $('#post-comments').empty();
                        for (let comm of res) {

                            let li = $(`<li></li>`);
                            li.text(comm.text);

                            $('#post-comments').append(li);
                        }
                        
                        //SLAGAM GI TUKA ZA DA SE ZARDAT ZAEDNO S KOMENTARITE
                        $('#post-title').text(title);
                        $('#post-body').text(body);
                    })
                    .catch(function (err) {
                        console.log('ERROR')
                        console.log(err)
                    });



            })
            .catch(function (err) {
                console.log(err)
            });


    });


    //MOJEHME DA POLZVAME I Promise.all([]);

}

