function attachAllEvents() {

    $("#linkHome").on('click', showHomeView)
    $("#linkLogin").on('click', showLoginView)
    $("#linkRegister").on('click', showRegisterView)
    $("#linkListBooks").on('click', listBooks)
    $("#linkCreateBook").on('click', showCreateBookView)
    $("#linkLogout").on('click', logoutUser)

    $("#formLogin").on('submit', loginUser)
    $("#formRegister").on('submit', registerUser)
    $("#formCreateBook").on('submit', createBook)
    $("#formEditBook").on('submit', editBook)
    $("form").on('submit', function (event) { event.preventDefault() })

    $("#infoBox, #errorBox").on('click', function () {
        $(this).fadeOut()
    })

    $(document).on({
        ajaxStart: function () { $("#loadingBox").show() },
        ajaxStop: function () { $("#loadingBox").hide() }
    })
}