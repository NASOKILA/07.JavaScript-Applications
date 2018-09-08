$(() => {
    "use strict";

    const sammyApp = Sammy('#main', function () {

        this.get('#/index', (ctx) => {
            ctx.swap('<h1>Home Page</h1>')
        });


        this.get('#/about', function () {
            this.swap('<h1>About Page</h1>');
        });

        this.route('get', '#/contact', (ctx) => {
            ctx.swap('<h1>Contact Page</h1>');
        })

        this.get('#/book/:bookId', function () {

            let bookId = this.params.bookId;

            let path = this.path;

            this.swap(`<h1>Book ${bookId}</h1>`);
        })


        this.get('#/login', (ctx) => {

            ctx.swap(`<form action="#/login" method="post">
            User: <input name="user" type="text">
            Pass: <input name="pass" type="password">
            <input type="submit" value="Login">
            </form>`);
        })


        this.post('#/login', (ctx) => {
            ctx.redirect('#/index');
        })


        this.use('Handlebars', 'hbs');

        this.get('#/hello/:name', function () {

            this.title = 'Hello!';
            this.name = this.params.name;

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function (res) {
                this.partial('/DemoApp/templates/greeting.hbs');
            }).catch(function (err) {
                console.log(err);
            })
        })
    })

    sammyApp.run();
})
