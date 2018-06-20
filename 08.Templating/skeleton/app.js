

$(() => {

   let contactsContext;

    (async function(){

        let contacts = await $.get('contacts.hbs');

        let contactsHtml = contacts.documentElement.outerHTML;

        let contactsTemplate = Handlebars.compile(contactsHtml);

        contactsContext = {
            contacts: [
                {
                  "firstName": "Ivan",
                  "lastName": "Ivanov",
                  "phone": "0888 123 456",
                  "email": "i.ivanov@gmail.com"
                },
                {
                  "firstName": "Jordan",
                  "lastName": "Kirov",
                  "phone": "0988 456 789",
                  "email": "jordk@gmail.com"
                },
                {
                  "firstName": "Maria",
                  "lastName": "Petrova",
                  "phone": "0899 987 654",
                  "email": "mar4eto@abv.bg"
                },
                {
                  "firstName": "Sterling",
                  "lastName": "Archer",
                  "phone": "0123 123 123",
                  "email": "archer@misix.com"
                },
                {
                  "firstName": "Lana",
                  "lastName": "Kane",
                  "phone": "0123 423 873",
                  "email": "lana@misix.com"
                },
                {
                  "firstName": "Cyril",
                  "lastName": "Figgis",
                  "phone": "0123 176 679",
                  "email": "cyril@misix.com"
                },
                {
                  "firstName": "Cheryl",
                  "lastName": "Tunt",
                  "phone": "0123 277 380",
                  "email": "cheryl@misix.com"
                },
                {
                  "firstName": "Pam",
                  "lastName": "Poovey",
                  "phone": "0123 070 768",
                  "email": "pam@misix.com"
                },
                {
                  "firstName": "Malory",
                  "lastName": "Archer",
                  "phone": "0123 999 999",
                  "email": "malory@misix.com"
                }
              ]
        }
    
        let htmlContacts = contactsTemplate(contactsContext);
        

        $('#list').append(htmlContacts);
       

        //click eventa
        $('.contact').click(function (){

            //vzimame si elementa
            let name = $(this)[0].innerText.toString();
            name = name.substring(2, name.length);

            //Pravim taka che samo selektiraniq da ima background
            //pravim gi vsichki sus siv background
            $('.contact').each((i, e) => {
                $(e).css('background', '#EEE');
            });

            //na selektiraniq mu slagame oranjev background
            $(this).css('background', '#d59450');

            //imeto i familiqta
            let firstN = name.split(' ')[0];
            let lastN = name.split(' ')[1];
        
            (async function(){
        
                let details = await $.get('details.hbs');
                let detailsHtml = details.documentElement.outerHTML;
                let detailsTemplate = Handlebars.compile(detailsHtml);

                
                let arrayOfNames = contactsContext.contacts.filter(c => c.firstName === firstN && c.lastName === lastN);
                let objToPass = {
                    contacts: arrayOfNames
                }
                
                let htmlDetails = detailsTemplate(objToPass);     
                $('#details').empty();
                $('#details').append(htmlDetails);
            
            }())
            
        })

    })();
        
        
   


    

});