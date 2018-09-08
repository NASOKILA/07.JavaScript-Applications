

$(() => {
    const app = Sammy('#main', function () {

        let appCtx = this;

        appCtx.use('Handlebars', 'hbs');

        appCtx.get('#/home', loadHomePage());

        appCtx.get('#/about', loadAboutPage());

        appCtx.get('#/catalog', teamsController.loadCatalog);

        appCtx.get('#/catalog/:id', teamsController.loadTeamDetails);

        appCtx.get('#/login', loadLoginPage());

        appCtx.post('#/login', LoginUser());

        appCtx.get('#/register', loadRegisterPage());

        appCtx.post('#/register', RegisterUser());

        appCtx.get('#/logout', Logout());

        appCtx.get('#/join/::teamId', teamsController.joinTeam);
    });

    app.run();
});



function Logout() {
    return function Logout() {
        sessionStorage.clear();
        this.redirect('#/home');
        auth.showInfo('Successful logout!');
    };
}

function LoginUser() {
    return function LoginUser(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;
        auth.login(username, password)
            .then(function (userData) {
                auth.showInfo('Login successfull!');
                auth.saveSession(userData);
                ctx.redirect('#/home');
            })
            .catch(function (err) {
                console.log(err);
                auth.showError(err.responseJSON.error);
            });
    };
}

function RegisterUser() {
    return function registerUser(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;
        let repeatPassword = ctx.params.repeatPassword;

        if (password === repeatPassword) {
            auth.register(username, password, repeatPassword)
                .then(function (userData) {
                    auth.showInfo('Registration successfull!');
                    auth.saveSession(userData);
                    ctx.redirect('#/home');
                })
                .catch(function (err) {
                    console.log(err);
                    auth.showError(err.responseJSON.error);
                });
        }
        else {
            auth.showError('Passwords do not match!');
        }
    };
}

function loadRegisterPage() {
    return function () {
        this.loadPartials({
            header: 'templates/common/header.hbs',
            registerForm: 'templates/register/registerForm.hbs',
            footer: 'templates/common/footer.hbs'
        })
            .then(function () {
                this.partial('templates/register/registerPage.hbs');
            });
    };
}

function loadLoginPage() {
    return function () {
        this.loadPartials({
            header: 'templates/common/header.hbs',
            loginForm: 'templates/login/loginForm.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/login/loginPage.hbs');
        });
    };
}

function loadAboutPage() {
    return function (ctx) {
        this.loadPartials({
            header: 'templates/common/header.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {

            ctx.loggedIn = auth.isAuthenticated();

            ctx.username = auth.getUsername();

            this.partial('templates/about/about.hbs');
        });
    };
}

function loadHomePage(ctx) {
    return function (ctx) {

        this.loadPartials({
            header: 'templates/common/header.hbs',
            footer: 'templates/common/footer.hbs',
        }).then(function () {

            ctx.loggedIn = auth.isAuthenticated();

            ctx.username = auth.getUsername();

            this.partial('templates/home/home.hbs');
        });
    };
}
