
const URL = 'https://phonebook-d76c9.firebaseio.com/phonebook';

$('#btnLoad').click(function () {

    //zarejdame ot bazata nov kontakt sus POST zaqvka
    //durpame gi s GET zaqvka



    $.ajax({
        'method': 'GET',
        'url': URL + '.json',
        'success': handleSuccess,
        'error': handleError
    });

    function handleSuccess(res) {
        //purvo chistim <ul> ot predishni li-ta
        $('#phonebook').empty();

        for (let id in res) {

            let valueObj = res[id];
            let name = valueObj.name;
            let phone = valueObj.phone;

            //make delete button
            let deleteBtn = $(`<a href="#"> [Delete]</a>`);
            deleteBtn.click(function () {

                let li = $($(this).parent())[0];

                $.ajax({
                    'method': 'DELETE',
                    'url': URL + `/${id}.json`
                })
                    .then(

                        //toq put polzvame .then() koeto se izpulnqva ako zqvkata e uspeshna.
                        //triem samiq element <li> ot <ul>
                        $(this).parent().remove()

                    );
            });


            //pravim si li-to
            let li = $(`<li>${name}: ${phone}</li>`)
                .append(deleteBtn);

            //appendvame li-to za <ul>

            $('#phonebook').append(li);
        }
    }

    function handleError(err) { 
        console.log('ERROR');
        console.log(err);
    }

});


$('#btnCreate').click(function () {

    //suzdavame v bazata nov kontakt sus POST zaqvka

    //vzimme si stoinostta ot input poletata.
    let personName = $('#person').val();
    let personPhone = $('#phone').val();

    //Ako sa "" ne pravim nishto
    if(personName === "" || personPhone === "")
        return;
    
    //chistim inputite
    clearInputs();


    //VAJNOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!
    //Kogato postvame trqbva da napravim obekta na string sus obj.stringify();

    $.ajax({

        method: 'POST',
        url: URL + '.json',
        data: JSON.stringify({ "name": personName, "phone": personPhone }),
        success: function (res) {

            //vzimame si ID-to na kontakto na koito sme kliknali.
            let id = $(res).parent().prevObject[0].name;
           
            //make delete button
            let deleteBtn = $(`<a href="#"> [Delete]</a>`);
            deleteBtn.click(function () {

                let li = $($(this).parent())[0];

                $.ajax({
                    'method': 'DELETE',
                    'url': URL + `/${id}.json`
                }).then(

                        //toq put polzvame .then() koeto se izpulnqva ako zqvkata e uspeshna.
                        //triem samiq element <li> ot <ul>
                        $(this).parent().remove()

                    );
            });

            //pravim si li-to
            let li = $(`<li>${personName}: ${personPhone}</li>`)
                .append(deleteBtn);

            //appendvame li-to za <ul>
            $('#phonebook').append(li);

        },
        error: function (err) {
            console.log("ERRROR")
            console.log(err)
        }
    });


});


function clearInputs()
{
    $('#person').val("");
    $('#phone').val("");
}



