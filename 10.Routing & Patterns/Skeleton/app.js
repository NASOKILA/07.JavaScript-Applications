$(() => {

    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        this.get('#/index.html', (ctx) => {


            ctx.isAuth = auth.isAuth();


            $.ajax('data.json')
                .then((contactsArr) => {

                    ctx.contacts = contactsArr;

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
                            
                            ctx.partials = this.partials;
                            render(ctx);
                            this.partial('./templates/welcome.hbs');
                        })
                })
                .catch(console.error);

            function render() {
                ctx.partial('./templates/welcome.hbs')
                    .then(attachEvents);
            }

            function attachEvents() {
                $('.contact').click(function () {
                
                    console.log(this);
                    let index = $(this).closest('.contact').attr('data-id');
                    ctx.selected = ctx.contacts[index];
                    render();
                });
            }
        });



        this.get('#/register.html', (ctx) => {

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

            let pass = password === repeatedPassword && username !== '' && password !== '';

            if (pass) {
                auth.register(username, password);

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
                ctx.redirect('#/index.html');
                alert('Welcome ' + username + ' :)');
            }, 2000)
        });
    });

    app.run();

});