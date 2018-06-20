$(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
        // TODO: Render cat template and attach events

        let source = await $.get('cat.hbs');
        let template = Handlebars.compile(source);
        
        //vzimame si masiva sus vsichki kotki ot 'windows'.
        let cats = window.cats;

        let obj = {
            'cats' : cats
        }

        let html = template(obj);
        $('#allCats').append(html);
    
    
        //attach event
        $('.card-block .btn').click(function(){
            
            //VAJNO !!!
            // Vmesto $(this).parent().find('...'); 
            //mojem da polzvame .next();
            
            let div = $(this).parent().find('div'); //$(this).next()   PAK STAWA
            
            
            //Promenqme texta na butona pri vseki klick.
            let text = $(this).text();
            if(text.includes('Show'))
                $(this).text(text.replace('Show', 'Hide'));
            else
                $(this).text(text.replace('Hide', 'Show'));
            

            div.toggle();
        });
    
    }




})
