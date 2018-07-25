
const URL = 'https://phonebook-d76c9.firebaseio.com/phonebook';

$('#btnLoad').click(function () {

    $.ajax({
        'method': 'GET',
        'url': URL + '.json',
        'success': handleSuccess,
        'error': handleError
    });

    function handleSuccess(res) {

        $('#phonebook').empty();

        for (let id in res) {

            let valueObj = res[id];
            let name = valueObj.name;
            let phone = valueObj.phone;

            let deleteBtn = $(`<a href="#"> [Delete]</a>`);
            deleteBtn.click(function () {

                let li = $($(this).parent())[0];

                $.ajax({
                    'method': 'DELETE',
                    'url': URL + `/${id}.json`
                })
                    .then(
                        $(this).parent().remove()
                    );
            });


            let li = $(`<li>${name}: ${phone}</li>`)
                .append(deleteBtn);

            $('#phonebook').append(li);
        }
    }

    function handleError(err) {
        console.log('ERROR');
        console.log(err);
    }
});


$('#btnCreate').click(function () {

    let personName = $('#person').val();
    let personPhone = $('#phone').val();

    if (personName === "" || personPhone === "")
        return;

    clearInputs();

    $.ajax({

        method: 'POST',
        url: URL + '.json',
        data: JSON.stringify({ "name": personName, "phone": personPhone }),
        success: function (res) {

            let id = $(res).parent().prevObject[0].name;
            let deleteBtn = $(`<a href="#"> [Delete]</a>`);

            deleteBtn.click(function () {

                let li = $($(this).parent())[0];

                $.ajax({
                    'method': 'DELETE',
                    'url': URL + `/${id}.json`
                }).then($(this).parent().remove());
            });

            let li = $(`<li>${personName}: ${personPhone}</li>`)
                .append(deleteBtn);

            $('#phonebook').append(li);
        },
        error: function (err) {
            console.log("ERRROR")
            console.log(err)
        }
    });
});

function clearInputs() {
    $('#person').val("");
    $('#phone').val("");
}