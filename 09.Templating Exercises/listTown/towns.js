
function attachEvents(){
    
    
    $('#btnLoadTowns').click(async function(){

        let townsNames = $('#towns').val().split(',')
        .map(e => e.trim());
        
        let source = await $.get('town-template.hbs');
        
        let template = Handlebars.compile(source);
        
        let towns = [];
        
        townsNames.forEach(element => {
            towns.push({'name' : element})
        });

        let obj = {
            towns
        }
        
        let html = template(obj);
        
        $('#root').empty();
        $('#root').append(html);
        
    });
}

        //Sofia, Athenes, Belgrad
