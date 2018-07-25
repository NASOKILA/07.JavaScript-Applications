
const BASE_URL = 'https://baas.kinvey.com/'
const APP_KEY = 'kid_BJCfsj9B'
const APP_SECRET = 'e2bfc81da6c4490eb548e16a24b27c56'
const AUTH_HEADERS = { 'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET) }
const BOOKS_PER_PAGE = 10

function loginUser() {

    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: { username, password }
    })
        .then(function (res) {
            signInUser(res, 'Login successfull.')
        })
        .catch(handleAjaxError);
}

function registerUser() {

    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: { username, password }
    })
        .then(function (res) {
            signInUser(res, 'Registration successfull.');
        })
        .catch(function (err) {
            showError(err);
        });
}

function listBooks() {

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }

    }).then(function (res) {

        showView('viewBooks')

        displayPaginationAndBooks(res.reverse())
    })
}

function createBook() {

    let title = $($('#formCreateBook input')[0]).val();
    let author = $($('#formCreateBook input')[1]).val();
    let description = $('#formCreateBook textarea').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        data: { author, title, description },
        headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
    })
        .then(function (res) {
            listBooks();
            showInfo('Book created.');
        })
        .catch(function (err) {
            handleAjaxError(err);
        });
}

function deleteBook(book) {

    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id,
        headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
    })
        .then(function (res) {
            listBooks();
            showInfo('Book deleted.');
        })
        .catch(function (err) {
            handleAjaxError(err);
        })
}

function loadBookForEdit(book) {

    showView('viewEditBook');
    $('#formEditBook input[name=id]').val(book._id);
    $('#formEditBook input[name=title]').val(book.title);
    $('#formEditBook input[name=author]').val(book.author);
    $('#formEditBook textarea').val(book.description);
}

function editBook() {

    let title = $('#formEditBook input[name=title]').val();
    let author = $('#formEditBook input[name=author]').val()
    let description = $('#formEditBook textarea').val();

    let bookId = $('#formEditBook input[name=id]').val();

    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + bookId,
        data: { title, author, description },
        headers: { 'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken') }
    })
        .then(function (res) {
            listBooks();
            showView('viewBook')
            showInfo('Book edited.');
        })
        .catch(function (err) {
            handleAjaxError(err);
        });

}

function saveAuthInSession(userInfo) { }

function logoutUser() {
    sessionStorage.clear();
    showHideMenuLinks();
    showInfo('Logout successful.')
}

function signInUser(res, message) {

    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);

    showHomeView();
    showHideMenuLinks();
    showInfo(message);
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo')
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {

            $('#books > table').find('tr').each(function (index, el) {
                if (index !== 0)
                    $(el).remove();
            });

            let startBook = (page - 1) * BOOKS_PER_PAGE
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length)

            $(`a:contains(${page})`).addClass('active')

            for (let i = startBook; i < endBook; i++) {

                let currentBook = books[i];
                let deleteBtn = $('<a href="#">[Delete]</a>').click(function (e) {
                    deleteBook(currentBook);
                })

                let editBtn = $('<a href="#">[Edit]</a>').click(function (e) {
                    loadBookForEdit(currentBook);
                })

                let td = $('<td></td>')
                    .append(deleteBtn)
                    .append(editBtn);

                let template = $('<tr></tr>')
                    .append(`<td>${currentBook.title}</td>`)
                    .append(`<td>${currentBook.author}</td>`)
                    .append(`<td>${currentBook.description}</td>`)

                let currentUser = sessionStorage.getItem('userId');
                let currentBookCreator = currentBook._acl.creator;

                if (currentBookCreator === currentUser)
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
