
function attachEvents()
{
    $('#btnLoad').click(function(){
        
        $.ajax({
            method: 'GET',
            url : 'https://phonebook-d76c9.firebaseio.com/phonebook.json',
            success: function success(res){
                

                $('#phonebook').empty();

                //console.log('SUCCESS');
                for (let id in res) {
                    
                    let args = res[id];
                    let name = args.name;
                    let phone = args.phone;

                    let deleteBtn = $('<button>[Delete]</button>')
                        .click(function(){

                            $.ajax({
                                method : 'DELETE',
                                url : `https://phonebook-d76c9.firebaseio.com/phonebook/${id}.json`,
                                success : function s(res){
                                    console.log('Success');
                                },
                                error : function e(err){
                                    console.log('ERROR');
                                }
                            })

                            $(this).parent().remove();
                        });

                    let li = $(`<li>${name}: ${phone}</li>`)
                        .append(deleteBtn);
                    
                    $('#phonebook').append(li);
                }


            },
            error: function error(err)
            {
                console.log('ERROR');
            }
        });

    });

    $('#btnCreate').click(function(){

        let person = $('#person').val();
        let phone = $('#phone').val();

        $('#person').val("");
        $('#phone').val("");

        $.ajax({
            method:'POST',
            url: 'https://phonebook-d76c9.firebaseio.com/phonebook.json',
            data: JSON.stringify({'name':person, 'phone':phone}),
            success : function success(res){
                
                let id = res.name;
                
                let deleteBtn = $('<button>[Delete]</button>');
                deleteBtn.click(function(){
                    $.ajax({
                        method:'DELETE',
                        url:`https://phonebook-d76c9.firebaseio.com/phonebook/${id}.json`,
                    });

                    $(this).parent().remove();
                });

                let li = $(`<li>${person}: ${phone}</li>`);
                li.append(deleteBtn);

                $('#phonebook').append(li);
            
            },
            error : function error(err){
                console.log('ERROR');
            }
        })

    });
}












