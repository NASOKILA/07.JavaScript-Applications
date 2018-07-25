
function attachEvents() {

    const URL = 'https://baas.kinvey.com/appdata/kid_BJKFMbN9z/';
    const USERNAME = 'Peter';
    const PASSWORD = 'ppp';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
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

        $.ajax({

            method: 'GET',
            headers: AUTH,
            url: URL + 'posts/' + id
        })
            .then(function (res) {

                let title = res.title;
                let body = res.body;

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
}