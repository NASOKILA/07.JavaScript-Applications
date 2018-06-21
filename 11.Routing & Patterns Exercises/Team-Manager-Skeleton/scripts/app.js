

// Purvo instalirame bootstrap, jquery, handlebars i sammy chrez terminala sus 'npm install' 
// vkarvame si gi podredeni v HTML faila


//pochvame da si pravim aplikaciqta
$(() => {
    const app = Sammy('#main', function () {

        //setvame si this na otdelna promeniva za da ne se burkame        
        let appCtx = this;


        //vkuchvame si handlebars
        appCtx.use('Handlebars', 'hbs');

        //HOME CONTROLLER
        //pravim si routovete za stranicite: 
        appCtx.get('#/home', loadHomePage());

        appCtx.get('#/about', loadAboutPage());

        appCtx.get('#/catalog', teamsController.loadCatalog);
        
        appCtx.get('#/catalog/:id', teamsController.loadTeamDetails);


        //VIEW CONTROLLER
        appCtx.get('#/login', loadLoginPage());
        
        //post za login
        appCtx.post('#/login', LoginUser());

        appCtx.get('#/register', loadRegisterPage());

        //post za user
        appCtx.post('#/register', RegisterUser());

        appCtx.get('#/logout', Logout());
        

        appCtx.get('#/join/::teamId', teamsController.joinTeam);


    });

    app.run();
});



function Logout() {
    return function Logout() {
        sessionStorage.clear();
        //this.redirect();
        this.redirect('#/home');
        auth.showInfo('Successful logout!');
    };
}

function LoginUser() {
    return function LoginUser(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;
        //polzvame auth klasa koito gi ima vsichki metodi veche gotovi
        //trqbva da e VSICHKO ASINHROMNO I DA awaitnem za da ni vurne danni koito shte 
        //gi podavame na sessionStorage
        auth.login(username, password)
            .then(function (userData) {
                //Trqbva da 
                auth.showInfo('Login successfull!');
                auth.saveSession(userData);
                ctx.redirect('#/home'); //REDOREKTVAME KUM HOME PAGE
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
        //pravim si validaciqta
        if (password === repeatPassword) {
            //polzvame auth klasa koito gi ima vsichki metodi veche gotovi
            //trqbva da e VSICHKO ASINHROMNO I DA awaitnem za da ni vurne danni koito shte 
            //gi podavame na sessionStorage
            auth.register(username, password, repeatPassword)
                .then(function (userData) {
                    auth.showInfo('Registration successfull!');
                    auth.saveSession(userData);
                    ctx.redirect('#/home'); //REDOREKTVAME KUM HOME PAGE
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
            
            // HOME VIEW-to tursi promenliva loggedIn zakachame za kontexta dali sme lognati
            ctx.loggedIn = auth.isAuthenticated();
            
            //HEADER VIEW-to tursi username promenliva za da q izpushe kato se lognem
            ctx.username = auth.getUsername();
            
            this.partial('templates/about/about.hbs');
        });
    };
}

function loadHomePage(ctx) {
    return function (ctx) {
        
        this.loadPartials({
            //zarejdame partialite header i footer koito sa common za vsichki
            header: 'templates/common/header.hbs',
            footer: 'templates/common/footer.hbs',
        }).then(function () {
            
            // HOME VIEW-to tursi promenliva loggedIn zakachame za kontexta dali sme lognati
            ctx.loggedIn = auth.isAuthenticated();
            
            //HEADER VIEW-to tursi username promenliva za da q izpushe kato se lognem
            ctx.username = auth.getUsername();
            
            //i go slagame v home.hbs
            this.partial('templates/home/home.hbs');
        });
    };
}
