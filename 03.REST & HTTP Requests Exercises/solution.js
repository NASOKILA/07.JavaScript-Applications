

function attachEvents(){

    $('#submit').click('click', submit);
    $('#refresh').click('click', refresh);

    function submit()
    {
        let author = $('#author').val();
        let content = $('#content').val();
   
        if(author === "" || content === "")
            return;

        $('#author').val("");
        $('#content').val("");

        $.ajax({
            method : 'POST',
            url : 'https://messenger-90e59.firebaseio.com/messenger.json',
            data : JSON.stringify({'author' : author, 'content' : content, 'timestamp': Date.now()}),
            success: function success(res){
                console.log('Success');
            },
            error: function error(err){
                console.log('Error');
            }
        });


        $.ajax({
            method : 'GET',
            url : 'https://messenger-90e59.firebaseio.com/messenger.json',
            success: function success(res){
           
                let textAreaText = "";

                for (let mess in res) {
                    
                    let key = mess;
                    let values = res[key];
                    
                    let author = values.author;
                    let content = values.content;
                    let timestamp = values.timestamp;
                    
                    textAreaText += `${author}: ${content}\n`;
                    $('#messages').text(textAreaText);
                }

                $('#messages').text(textAreaText);
            },
            error: function error(err){
                console.log('Error');
            }
        });

    }
    
    function refresh()
    {
        $('#author').val("");
        $('#content').val("");

        let author = $('#author').val();
        let content = $('#content').val();
    
        $.ajax({
            method : 'GET',
            url : 'https://messenger-90e59.firebaseio.com/messenger.json',
            success: function success(res){
           
                let textAreaText = "";

                for (let mess in res) {
                    
                    let key = mess;
                    let values = res[key];
                    
                    let author = values.author;
                    let content = values.content;
                    let timestamp = values.timestamp;
                    
                    textAreaText += `${author}: ${content}\n`;
                    $('#messages').text(textAreaText);
                }

                $('#messages').text(textAreaText);
            },
            error: function error(err){
                console.log('Error');
            }
        });    
    
    }
}










