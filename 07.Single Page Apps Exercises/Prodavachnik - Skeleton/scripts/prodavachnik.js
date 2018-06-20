
const BASE_URL = 'https://baas.kinvey.com/'
const APP_KEY = 'kid_SynTc0i9z'
const APP_SECRET = 'c8ea46cb339d4834b62543e35d7c8e17'
const AUTH_HEADERS = { 'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET) }



function startApp() {

    showHideMenuLinks();
    attachEvents();

    function showHideMenuLinks() {

        //po default vinagi da se pokazva
        $('#linkHome').show();
        if (sessionStorage.getItem('authToken') === null) { // No logged in user
            $('section').hide();
            $('#linkListAds').hide();
            $('#linkCreateAd').hide();
            $('#linkLogout').hide();
            $('#loggedInUser').text('');
            $('#loggedInUser').hide();
            $('#linkLogin').show();
            $('#linkRegister').show();
        } else { // We have logged in user

            $('#linkLogin').hide();
            $('#linkRegister').hide();
            $('section').hide();
            $('#linkListAds').show();
            $('#linkCreateAd').show();
            $('#linkLogout').show();
            $('#loggedInUser').text("Welcome, " + sessionStorage.getItem('username') + "!")
            $('#loggedInUser').show();  
        }
        
        $('#viewHome').show();
    }

   /* (function showDefault() {

        //po default pokazvame
        $('#linkHome').show();
        $('#linkLogin').show();
        $('#linkRegister').show();

        //po default pokazvame #viewHome
        $('#viewHome').show();
    })();*/

    function attachEvents() {
        //slagame si klick eventi na butonite da pokazvat viewtata
        $('#linkLogin').click(showLoginView);
        $('#linkRegister').click(showRegisterView);
        $('#linkHome').click(showHomeView);
        $('#linkLogout').click(logout);
        $('#linkListAds').click(showAds);
        $('#linkCreateAd').click(showAddview);

        $('#formRegister #buttonRegisterUser').click(registerUser);
        $('#formLogin #buttonLoginUser').click(loginUser);
        $('#buttonCreateAd').click(createAdd);
        $('#buttonEditAd').click(edit);
        
    };

    function showAddview() {
        $('section').hide();
        $('#viewCreateAd').show();
    }

    function showAds() {
        $('section').hide();
        $('#viewAds').show();
        listAds();
    }

    function loadAddForEdit(add) {

        $('section').hide();
        $('#viewEditAd').show();

        //vrushtame starite stoinosti
        $('#formEditAd input[name=id]').val(add._id);        
        $('#formEditAd input[name=views]').val(add.views);        
        $('#formEditAd input[name=title]').val(add.title);
        $('#formEditAd div textarea').val(add.description);

        $('#formEditAd input[name=datePublished]').val(add.date);
        $('#formEditAd input[name=price]').val(add.price);
        $('#formEditAd input[name=image]').val(add.linkToImage);

    }

    function edit() {

        $('#loadingBox').show();

        let addId = $('#formEditAd input[name=id]').val();
        let newPublisher = sessionStorage.getItem('username');
        let newTitle = $('#formEditAd input[name=title]').val();
        let newDescription = $('#formEditAd div textarea').val();
        let newDate = $('#formEditAd input[name=datePublished]').val();
        let newPrice = $('#formEditAd input[name=price]').val();
        let newLinkToImage = $('#formEditAd input[name=image]').val();
        let views = Number($('#formEditAd input[name=views]').val());

        if (isNaN(views) || views === undefined || views === "")
            views = 0;

        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisements/' + addId,
            data: { 'views': views, 'price': newPrice, 'linkToImage': newLinkToImage, 'date': newDate, 'publisher': newPublisher, 'description': newDescription, 'title': newTitle },
            headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
        })
            .then(function (res) {

                setTimeout(function(){

                    $('#loadingBox').fadeOut();
                    showAds();
                    showInfo('Add edited.');
    
                },2000);

            })
            .catch(function (err) {
                handleAjaxError(err);
            });
    }

    function deleteAdd(add) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisements/' + add._id,
            headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
        })
            .then(function (res) {
                listAds();
                showInfo('Add deleted.');
            })
            .catch(function (err) {
                handleAjaxError(err);
            })
    }

    function listAds() {


        $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisements',
            headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }

        }).then(function (res) {

            //MAHAME STARITE KNIGI I DOBAVQME NOVI
            $('tbody').find('tr').each(function (index, el) {
                if (index !== 0)
                    $(el).remove();
            });


            for (let add of res.sort((a, b) => Number(a.views) < Number(b.views))) {

                let readMoreBtn = $(`<a href="#">[Read more]</a>`).click(function () {
                    readMore(add);
                })

                let deleteBtn = $(`<a href="#">[Delete]</a>`).click(function () {
                    deleteAdd(add);
                })

                let editBtn = $(`<a href="#">[Edit]</a>`).click(function () {
                    loadAddForEdit(add);
                })

                let tdButtons = $('<td></td>')
                    .append(readMoreBtn)
                    .append(deleteBtn)
                    .append(editBtn)

                let tr = $('<tr></tr>')
                    .append(`<td>${add.title}</td>`)
                    .append(`<td>${add.description}</td>`)
                    .append(`<td>${add.publisher}</td>`)
                    .append(`<td>${add.date}</td>`)
                    .append(`<td>${add.price}</td>`);

                let currentUser = sessionStorage.getItem('userId');
                let currentBookCreator = add._acl.creator;

                if (currentBookCreator === currentUser)
                    tr.append(tdButtons);
                else
                    tr.append('<td></td>');



                $('tbody').append(tr);

            }

        })

    }

    function readMore(add) {

        $('section').hide();
        $('#viewDetailsAd').empty();
        $('#loadingBox').show();

        increaseViews(add);

        var img = $(`<img src="${add.linkToImage}" alt="No Image Avaliable" height="142" width="142"></img>`)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                } else {
                    $("#viewDetailsAd").append(img);
                }
            });

        setTimeout(function () {
            let div = $('<div>').append(
                $('<br>'),
                $('<label>').text('Title:'),
                $('<h1>').text(add.title),
                $('<label>').text('Description:'),
                $('<p>').text(add.description),
                $('<label>').text('Publisher:'),
                $('<div>').text(add.publisher),
                $('<label>').text('Data:'),
                $('<div>').text(add.date),
                $('<label>').text(`Views:${add.views}`),
            )

            $('#viewDetailsAd').append(div);
            $('#loadingBox').hide();
            $('#viewDetailsAd').show();
            
        }, 1000);

    }

    function increaseViews(add) {


        let addId = add._id;
        let views = Number(add.views) + 1;

        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisements/' + addId,
            data: { 'views': views, 'price': add.price, 'linkToImage': add.linkToImage, 'date': add.date, 'publisher': add.publisher, 'description': add.description, 'title': add.title },
            headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
        })
            .then(function (res) {

            })
            .catch(function (err) {
                handleAjaxError(err);
            });
    }

    function showError(errorMsg) {
        let errorBox = $('#errorBox')
        errorBox.text("Error: " + errorMsg)
        errorBox.show()
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response)
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error."
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description
        showError(errorMsg)
    }

    function showInfo(message) {
        let infoBox = $('#infoBox')
        infoBox.text(message)
        infoBox.show()
        setTimeout(function () {
            $('#infoBox').fadeOut()
        }, 2000)
    }

    function showLoginView() {
        $('section').hide();
        $('#viewLogin').show();
    }

    function showRegisterView() {
        $('section').hide();
        $('#viewRegister').show();
    }

    function showHomeView() {
        $('section').hide();
        $('#viewHome').show();
    }

    function createAdd() {

        $('#loadingBox').show();

        let title = $($('#formCreateAd input')[0]).val();
        let description = $('#formCreateAd textarea').val();

        let date = $($('#formCreateAd input')[1]).val();
        let price = Number($($('#formCreateAd input')[2]).val());
        let linkToImage = $($('#formCreateAd input')[3]).val();
        let views = 0;
        //clear input fields

        $($('#formCreateAd input')[0]).val("");
        $('#formCreateAd textarea').val("");

        $($('#formCreateAd input')[1]).val("");
        $($('#formCreateAd input')[2]).val("");
        $($('#formCreateAd input')[3]).val("");

        let publisher = sessionStorage.username;

        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisements',
            data: { views, linkToImage, price, date, publisher, description, title },
            headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
        })
            .then(function (res) {

                setTimeout(function(){
                    $('#loadingBox').fadeOut();
                    showAds();
                    showInfo('Add created.');
                },2000);
            })
            .catch(function (err) {
                handleAjaxError(err);
            })

    }

    function registerUser() {

        let username = $($('#formRegister input')[0]).val();
        let password = $($('#formRegister input')[1]).val();

        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: { username, password } //ako go stringifienem obekta koito poluchavame sudurja veche kriptirani user i parola
        }).then(function (res) {
            //Zapazvame usera v sesiqta
            signInUser(res, 'Registration successfull');

            $('#viewHome').show();
        })
            .catch(function (err) {
                alert(`Invalid credentials or username and password already in use !`)
            })

        //chistim poletata
        $($('#formRegister input')[0]).val("");
        $($('#formRegister input')[1]).val("");
    }

    function loginUser() {

        let username = $($('#formLogin input')[0]).val();
        let password = $($('#formLogin input')[1]).val();

        //Sega trqbv da se lohnem
        //NE PROMENQME NISHTO PO BAZATA NO TRQBVA DA SE LOGNEM SUS 'POST' ZAQVKA
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: { username, password }
        })
            .then(function (res) {
                signInUser(res, 'Login successfull.');

                $('#viewHome').show();
            })
            .catch(handleAjaxError);

        //chistim poletata
        $($('#formLogin input')[0]).val("");
        $($('#formLogin input')[1]).val("");
    }

    function logout() {
        //chistim sessiqta
        sessionStorage.clear();

        //i da promenim lnkovete za viewto
        showHideMenuLinks();

        showInfo('Logout successful.')
    }

    function signInUser(res, message) {

        //sega trqbva da zapzim imeto, autoken (autentikation token), i userId v session storage:
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
        sessionStorage.setItem('userId', res._id);

        //Preprashtame usera na home stranicata.
        showHomeView();

        //POKAZVAME DRUGI LINKOVE GORE V MENUBARA, POKAZVAME TEZI KOITO SA ZA VECHE REGISTRIRA USER.
        showHideMenuLinks(); //skriva vsichki linkove proverqva dali sme lognati i ako sme, ni pokazva linkovete za lognat user    

        showInfo(message);
    }



}

