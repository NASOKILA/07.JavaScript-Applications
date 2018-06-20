
function attachEvents() {

    const appKey = "kid_ry9Ndeucf";
    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/biggestCatches`;

    const username = "guest";
    const password = "guest";

    //keshirame s BASE_64 Encoding, KINVEY GO IZIZKVA TAKA
    let BASE_64 = 'Basic ' + btoa(username + ":" + password);

    //Load Button
    $('.load').on('click', function () {

        //load all catches
        $.ajax({
            method: 'GET',
            url: baseUrl,
            headers: { 'Authorization': BASE_64 },  //TAKA GO ISKA KINVEY
            success: function handleSuccess(res) {


                $('#main').empty();

                //triem vsichki
                $('<div id="catches"></div>').appendTo('#main');

                //za vseki ot bazata mu pravim eventi na butonite i go zakachame za #catches
                for (let cat4 of res) {

                    let updateBtn = $(`<button class="update">Update</button>`).click(function () {

                        //make a post request to create a Catch

                        let angler = $(this).parent().find('.angler').val();
                        let weight = Number($(this).parent().find('.weight').val());
                        let species = $(this).parent().find('.species').val();
                        let location = $(this).parent().find('.location').val();
                        let bait = $(this).parent().find('.bait').val();
                        let captureTime = Number($(this).parent().find('.captureTime').val());

                        //suzdavame si obekta koito shte ni sloji dannite v bazata
                        let catchObj = { angler, weight, species, location, bait, captureTime };


                        $.ajax({
                            method: 'PUT',
                            data: JSON.stringify(catchObj),
                            url: baseUrl  + `/${cat4._id}`,
                            headers: 
                            {
                                'Content-Type' : 'application/json', 
                                'Authorization': BASE_64 
                            },
                            success: function s(res) {
                                //console.log(res);
                            },
                            error: function e(err) {
                                //console.log(err);                
                            }
                        });

                    });


                    let deleteBtn = $(`<button class="delete">Delete</button>`).click(function () {

                        //triem go ot bazata
                        $.ajax({
                            method: 'DELETE',
                            url: baseUrl + `/${cat4._id}/`,
                            headers: {
                                'Content-Type' : 'application/json', 
                                'Authorization': BASE_64 
                            },
                        })
                        $(this).parent().remove();

                    });


                    let template = $(
                        `<div class="catch" data-id="<id-goes-here>">
                        <label>Angler</label>
                        <input type="text" class="angler" value="${cat4.angler}">
                        <label>Weight</label>
                        <input type="number" class="weight" value="${cat4.weight}">
                        <label>Species</label>
                        <input type="text" class="species" value="${cat4.species}">
                        <label>Location</label>
                        <input type="text" class="location" value="${cat4.location}">
                        <label>Bait</label>
                        <input type="text" class="bait" value="${cat4.bait}">
                        <label>Capture Time</label>
                        <input type="number" class="captureTime" value="${cat4.captureTime}">
                    </div>`);

                    template.append(updateBtn);
                    template.append(deleteBtn);

                    $('#catches').append(template);

                }

            },
            error: function handleError(res) {
                console.log('ERROR')
                console.log(res)
            }

        })


        $('.angler').val();
        $('.angler').val();
        $('.angler').val();
    })

    //Add Button - Add a new catch
    $('.add').on('click', function () {

        //make a post request to create a Catch

        let angler = $('#addForm .angler').val();
        let weight = Number($('#addForm .weight').val());
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = Number($('#addForm .captureTime').val());

        //suzdavame si obekta koito shte ni sloji dannite v bazata
        let catchObj = { angler, weight, species, location, bait, captureTime };

        //suzdavame si noviq catch
        $.ajax({
            method: 'POST',
            data: JSON.stringify(catchObj),
            url: baseUrl,
            headers: {
                'Content-Type' : 'application/json', 
                'Authorization': BASE_64 
            },
            success: function s(res) {
                //console.log(res);
            },
            error: function e(err) {
                //console.log(err);                
            }
        });


        //triem poletata:
        $('#addForm .angler').val("");
        $('#addForm .weight').val("");
        $('#addForm .species').val("");
        $('#addForm .location').val("");
        $('#addForm .captureTime').val("");

    })

}




