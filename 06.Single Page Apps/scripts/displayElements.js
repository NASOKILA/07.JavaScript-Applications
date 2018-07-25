
function showView(viewName) {
    $('main > section').hide()
    $('#' + viewName).show()
}

function showHideMenuLinks() {
    $("#linkHome").show()
    if (sessionStorage.getItem('authToken') === null) {
        $("#linkLogin").show()
        $("#linkRegister").show()
        $("#linkListBooks").hide()
        $("#linkCreateBook").hide()
        $("#linkLogout").hide()
        $('#loggedInUser').text('')
    } else {
        $("#linkLogin").hide()
        $("#linkRegister").hide()
        $("#linkListBooks").show()
        $("#linkCreateBook").show()
        $("#linkLogout").show()
        $('#loggedInUser').text("Welcome, " + sessionStorage.getItem('username') + "!")
    }
}

function showInfo(message) {
    let infoBox = $('#infoBox')
    infoBox.text(message)
    infoBox.show()
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000)
}

function showError(errorMsg) {
    let errorBox = $('#errorBox')
    errorBox.text("Error: " + errorMsg)
    errorBox.show()
}

function showHomeView() {
    showView('viewHome')
}

function showLoginView() {
    showView('viewLogin')
    $('#formLogin').trigger('reset')
}

function showRegisterView() {
    $('#formRegister').trigger('reset')
    showView('viewRegister')
}

function showCreateBookView() {
    $('#formCreateBook').trigger('reset')
    showView('viewCreateBook')
}