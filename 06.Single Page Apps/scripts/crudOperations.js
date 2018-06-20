
const BASE_URL = 'https://baas.kinvey.com/'
const APP_KEY = 'kid_BJCfsj9B'
const APP_SECRET = 'e2bfc81da6c4490eb548e16a24b27c56'
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)}
const BOOKS_PER_PAGE = 10

function loginUser() {

    //vzimame ot inputa stoinostite
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();

    //Sega trqbv da se lohnem
    //NE PROMENQME NISHTO PO BAZATA NO TRQBVA DA SE LOGNEM SUS 'POST' ZAQVKA
    $.ajax({
        method : 'POST',
        url : BASE_URL + 'user/' + APP_KEY + '/login',
        headers : AUTH_HEADERS,
        data : {username, password} 
    })
    .then(function(res){
        signInUser(res, 'Login successfull.')
    })
    .catch(handleAjaxError);
}

function registerUser() {
    
    //vzimame ot inputa stoinostite
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();
    
    //Pravim si post zaqvkata
    $.ajax({
        method : 'POST',
        url : BASE_URL + 'user/' + APP_KEY + '/',
        headers : AUTH_HEADERS,
        data : { username, password } //ako go stringifienem obekta koito poluchavame sudurja veche kriptirani user i parola
    })
    .then(function(res){
        //Zapazvame usera v sesiqta
        signInUser(res, 'Registration successfull.');
    })
    .catch(function(err){
        //pri greshka vinagi izvikame edna funkciq
        showError(err);
    });

}

function listBooks() {
    
    $.ajax({
        method : 'GET',
        url : BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers : {'Authorization' : 'Kinvey ' + sessionStorage.getItem('authToken')}  
        
    }).then(function(res){

        //izvikvame si viewto
        showView('viewBooks')
        
        //mahame paginationa i dobavqme nov
        //reversvame za da poluchavame na purvata stranica poslednite registrirani knigi
        displayPaginationAndBooks(res.reverse())         
    })

}

function createBook() {
    
    let title = $($('#formCreateBook input')[0]).val();

    let author = $($('#formCreateBook input')[1]).val();

    let description = $('#formCreateBook textarea').val();
    

    $.ajax({
        method : 'POST',
        url : BASE_URL + 'appdata/' + APP_KEY + '/books',
        data : {author, title, description},
        headers : {'Authorization' : 'Kinvey ' + sessionStorage.getItem('authToken')}  
    })
    .then(function(res){
        listBooks();
        showInfo('Book created.');
    })
    .catch(function(err){
        handleAjaxError(err);
    });

    
}

function deleteBook(book) {
    
    $.ajax({
        method : 'DELETE',
        url : BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id,
        headers : {'Authorization' : 'Kinvey ' + sessionStorage.getItem('authToken')}
    })
    .then(function(res){
        listBooks();
        showInfo('Book deleted.'); 
    })
    .catch(function(err){
        handleAjaxError(err);
    })
}

function loadBookForEdit(book) {

    showView('viewEditBook'); //pokazvame viewto

    //setvame si starite stoinosti
    $('#formEditBook input[name=id]').val(book._id);
    $('#formEditBook input[name=title]').val(book.title);
    $('#formEditBook input[name=author]').val(book.author);
    $('#formEditBook textarea').val(book.description);


    //kato kliknem na Edit veche si ima zakachen event koito za izvikva dolnata funkciq
}

function editBook() {
    
    //vzimame si stoinostite
    let title = $('#formEditBook input[name=title]').val();
    let author = $('#formEditBook input[name=author]').val()
    let description = $('#formEditBook textarea').val();

    //i book id
    let bookId = $('#formEditBook input[name=id]').val();

    //pravim si PUT zaqvkata koqto ni promenq knigata
    $.ajax({
        method : 'PUT',
        url : BASE_URL + 'appdata/' + APP_KEY + '/books/' + bookId,
        data : {title, author, description},
        headers : {'Authorization' : 'Kinvey ' + sessionStorage.getItem('authToken')}  
    })
    .then(function(res){
        listBooks();
        showView('viewBook')
        showInfo('Book edited.');
    })
    .catch(function(err){
        handleAjaxError(err);
    });
    
}

function saveAuthInSession(userInfo) {
    // TODO
}

function logoutUser() {
    

    //TRQBVA DA IZPRATIM I ZAQVKA ZA DA ZNAE KINVEY CHE TOZI TOKEN VECHE NE E VALIDEN


    //za da logoutnem daden user trqbva da mu iztriem neshtata ot session storage
    sessionStorage.clear();

    //i da promenim lnkovete za viewto
    showHideMenuLinks();

    //vadim suobshtenieto za uspeshen logout
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

    //pokazvame suobshtenieto (V ZELENO) CHE REGISTRACIQTE E USPESHNA
    showInfo(message); 
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo')
    if(pagination.data("twbs-pagination")){
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) { //poluchavame nomera na stranicata i knigite

            //MAHAME STARITE KNIGI I DOBAVQME NOVI
            $('#books > table').find('tr').each(function(index, el){
                if(index !== 0)
                    $(el).remove(); 
            });

            let startBook = (page - 1) * BOOKS_PER_PAGE
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length)
            
            $(`a:contains(${page})`).addClass('active')
                
            for (let i = startBook; i < endBook; i++) {
                
                let currentBook = books[i];
                
                let deleteBtn = $('<a href="#">[Delete]</a>').click(function(e){
                    deleteBook(currentBook); //podavame tekushtata kniga
                })
                
                let editBtn = $('<a href="#">[Edit]</a>').click(function(e){
                    loadBookForEdit(currentBook); //podavame tekushtata kniga
                })
                
                let td = $('<td></td>')
                    .append(deleteBtn)
                    .append(editBtn);


                let template = $('<tr></tr>')
                .append(`<td>${currentBook.title}</td>`)
                .append(`<td>${currentBook.author}</td>`)
                .append(`<td>${currentBook.description}</td>`)


                //AKO NIE SME AVToRA NA KNIGATA ZAKACHAME I BUTONITE
                let currentUser = sessionStorage.getItem('userId');
                let currentBookCreator = currentBook._acl.creator; 
                
                if(currentBookCreator === currentUser)
                    template.append(td);
                
                $(template).appendTo($('tbody'));
            }
        }
    })
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}


