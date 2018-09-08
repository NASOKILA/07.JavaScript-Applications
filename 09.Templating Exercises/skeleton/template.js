$(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
    
        let source = await $.get('cat.hbs');
        let template = Handlebars.compile(source);
        
        let cats = window.cats;

        let obj = {
            'cats' : cats
        }

        let html = template(obj);
        $('#allCats').append(html);
    
        $('.card-block .btn').click(function(){
            
            let div = $(this).parent().find('div'); 
            
            let text = $(this).text();
            if(text.includes('Show'))
                $(this).text(text.replace('Show', 'Hide'));
            else
                $(this).text(text.replace('Hide', 'Show'));
            
            div.toggle();
        });
    }
})