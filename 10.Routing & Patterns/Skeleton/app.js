$(() => {

    //PUSNI SI STRANICATA V BRAWSERA DA VIDISH DALI IMA GRESHKI
    //ZA MOMENTA TRQBVA DA NE VIJDASH NISHTO


    //Pravim si sammy applicationa
    const app = Sammy('#main', function () {

        //01.Vkluchvame si handlebars.hbs
        this.use('Handlebars', 'hbs');

        //02.Pravim Nachalnata stranica  //MOJEM DA SLOJIM PROSTO '/' KATO ROUTE VMESTO '#/index.html
        this.get('#/index.html', (ctx) => {



            //Zarajdame glavniq templeit, header, footer, navigation, loginformata i contactPage-a, 
            //Trqbva ni i funkciqta 'isAuth()' za da vidim dali sme lognati ili ne

            //vzimame si funkciqta ot 'isAuth' ot 'auth' koito se vrustha ot 'authService' faila ot 'js' papkata !!!
            ctx.isAuth = auth.isAuth();


            //ako sme lognati zapisvame vsichki kontakti ot fila data.js v masiva conatacts  
            $.ajax('data.json')
                .then((contactsArr) => {

                    //podavame kontaktite
                    ctx.contacts = contactsArr;

                    //zarejdame si partianite templeiti
                    ctx.loadPartials({
                        header: '/Skeleton/templates/common/headerPartial.hbs',
                        footer: '/Skeleton/templates/common/footerPartial.hbs',
                        navigation: '/Skeleton/templates/common/navigation.hbs',
                        loginForm: '/Skeleton/templates/forms/loginForm.hbs',
                        contactPage: '/Skeleton/templates/contacts/contactPage.hbs',
                        contactsList: '/Skeleton/templates/contacts/contactsList.hbs',
                        contact: '/Skeleton/templates/contacts/contact.hbs',
                        contactDetails: '/Skeleton/templates/contacts/contactDetails.hbs',
                    })
                        .then(function () {
                            
                            //zarejdame si partial templeitite i zakachame eventite
                            ctx.partials = this.partials;
                            render(ctx);
                            //ZAREDENITE PARTIALI GI SLAGAME V TOZI ZASHTOTO NI E GLAVEN
                            this.partial('./templates/welcome.hbs');
                        })
                })
                .catch(console.error);
            //POKAZVAME DETAILS NA KLIKNATIQ KONTAKT

            function render() {
                //zarejdame si templeitite i im zakachame event
                ctx.partial('./templates/welcome.hbs')
                    .then(attachEvents);
            }

            function attachEvents() {
                $('.contact').click(function () {
                
                    console.log(this);

                    //vzimame si indexa na klikntiq element i go zarejdame
                    let index = $(this).closest('.contact').attr('data-id');
                    
                    //zapazvame si v kontexta detaila s tozi index:
                    ctx.selected = ctx.contacts[index];
                    render();
                });
            }
        });



        this.get('#/register.html', (ctx) => {

            //Pak shte ni trqbva isAuth() funkciqta

            ctx.isAuth = auth.isAuth();

            ctx.loadPartials({
                header: '/Skeleton/templates/common/headerPartial.hbs',
                navigation: '/Skeleton/templates/common/navigation.hbs',
                footer: '/Skeleton/templates/common/footerPartial.hbs',
            })
                .then(function () {
                    this.partial('./templates/forms/registerForm.hbs');
                });
        });


        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatedPassword = ctx.params.repeatPassword;

            //proverqvame dali parolite sa ednakvi i dali inputite sa prazni
            let pass = password === repeatedPassword && username !== '' && password !== '';

            if (pass) {
                //Ako vsichko e ok si polzvame register funkciqta za da registrirame nov user
                auth.register(username, password);

                //i redirektvame kum index.html
                //Sled dve sekundi ni redirektva kum index stranicata

                setTimeout(() => {
                    ctx.redirect('#/index.html');
                    ctx.redirect('#/register.html');
                    ctx.redirect('#/index.html');
                    alert('Welcome ' + username + ' :)');
                }, 2000)
            }
            else {
                alert('Passwords do not match or some input field is empty!');

                $('#newUsername').val("");
                $('#newPassword').val("");
                $('#newPassRep').val("");
            }
        });


        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
            setTimeout(function () {
                //zakachame si vsichki partial templeiti za kontexta zashtoto shte ni potrqbvad aza zakachaneto na eventi um contaktite.              
                ctx.redirect('#/index.html');
                alert('Welcome ' + username + ' :)');
            }, 2000)
        });



    });




    //vkluchvame si prilojenieto
    app.run();

});