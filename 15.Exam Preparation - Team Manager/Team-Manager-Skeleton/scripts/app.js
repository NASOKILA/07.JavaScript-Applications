$(() => {
    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');


        this.get('/', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.hasTeam = sessionStorage.getItem('teamId') !== 'undefined';
            ctx.teamId = sessionStorage.getItem('teamId');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/home/home.hbs')
            })
        })

        this.get('index.html', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.hasTeam = sessionStorage.getItem('teamId') !== 'undefined';
            ctx.teamId = sessionStorage.getItem('teamId');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/home/home.hbs')
            })
        })

        this.get('#/home', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.hasTeam = sessionStorage.getItem('teamId') !== 'undefined';
            ctx.teamId = sessionStorage.getItem('teamId');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/home/home.hbs')
            })
        })

        this.get('#/about', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/about/about.hbs')
            })
        })

        this.get('#/login', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                loginForm: 'templates/login/loginForm.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/login/loginPage.hbs')
            })
        })

        this.post('#/login', (ctx) => {
          
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo(`User ${username} logged in successfully !`)
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError)
        })

        this.get('#/register', (ctx) => {

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                registerForm: 'templates/register/registerForm.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/register/registerPage.hbs')
            })
        })

        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPassword;

            if (password !== repeatPassword) {
                notify.showError(`Passwords must match !`)
                return;
            }

            auth.register(username, password, repeatPassword)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo(`User ${username} registered successfully !`)
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError)

        })

        this.get('#/logout', (ctx) => {

            auth.logout()
                .then(function () {
                    let username = sessionStorage.getItem('username');
                    notify.showInfo(`User ${username} logged out successfully !`);
                    sessionStorage.clear();
                    ctx.redirect('#/home')
                })
                .catch(notify.handleError);
        })

        this.get('#/catalog', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            //Proverqvame dali ima sobstven team
            ctx.hasNoTeam = sessionStorage.teamId === 'undefined';

            teamsService.loadTeams()
                .then((teams) => {

                    ctx.teams = teams

                    ctx.loadPartials({
                        header: 'templates/common/header.hbs',
                        team: 'templates/catalog/team.hbs',
                        footer: 'templates/common/footer.hbs',
                    }).then(function () {
                        this.partial('templates/catalog/teamCatalog.hbs')
                    })
                })

        })

        //deteils
        this.get('#/catalog/:teamId', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }


            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            let teamId = ctx.params.teamId.slice(1);

            teamsService.getAllUsers()
                .then((users) => {

                    ctx.members = users.filter(u => u.teamId === teamId);
                    
                    teamsService.loadTeamDetails(teamId)
                        .then((team) => {

                            ctx.team = team
                            ctx.name = team.name
                            ctx.comment = team.comment

                            //za da vidim dali sme v tozi team veche ni trqbva isOnTeam
                            ctx.isOnTeam = team._id === sessionStorage.getItem("teamId")

                            //ako nie sme suzdateli trqbva da imame i Edit team zatova ni trqbva i teamId-to
                            ctx.isAuthor = sessionStorage.getItem('userId') === team._acl.creator;
                            ctx.teamId = team._id;

                           
                            ctx.loadPartials({
                                header: 'templates/common/header.hbs',
                                team: 'templates/catalog/team.hbs',
                                footer: 'templates/common/footer.hbs',
                                teamControls: 'templates/catalog/teamControls.hbs',
                                teamMember: 'templates/catalog/teamMember.hbs',
                            }).then(function () {
                                this.partial('templates/catalog/details.hbs')
                            })
                        })

                })



        })

        this.get('#/create', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');


            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                createForm: 'templates/create/createForm.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/create/createPage.hbs')
            })

        })

        this.post('#/create', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            let name = ctx.params.name;
            let comment = ctx.params.comment;

            teamsService.createTeam(name, comment)
                .then((team) => {
                    sessionStorage.setItem('teamId', team._id);
                    notify.showInfo(`Team ${name} created !`);
                    ctx.redirect(`#/join/:${team._id}`)
                });
        })

        this.get('#/join/:teamId', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            let teamId = ctx.params.teamId.slice(1);

            teamsService.joinTeam(teamId)
                .then(function (userInfo) {
                    auth.saveSession(userInfo)
                    auth.showInfo("Joined team!")
                    ctx.redirect("#/catalog")
                }).catch(auth.handleError)

        })

        this.get('#/leave', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            teamsService.leaveTeam()
                .then(function (userInfo) {

                    auth.saveSession(userInfo)
                    auth.showInfo("Team left!")
                    ctx.redirect("#/catalog")
                }).catch(auth.handleError)
        })

        this.get('#/edit/:teamId', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            ctx.loggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            
            let teamId = ctx.params.teamId.slice(1);

            teamsService.getTeamById(teamId)
                .then((team) => {
                    
                    ctx.team = team;

                    ctx.loadPartials({
                        header: 'templates/common/header.hbs',
                        editForm: 'templates/edit/editForm.hbs',
                        footer: 'templates/common/footer.hbs',
                    }).then(function () {
                        this.partial('templates/edit/editPage.hbs')
                    })
                })

            
        })
        
        this.post('#/edit/:teamId', (ctx) => {

            if (!auth.isAuth()) {
                notify.showError('User not logged in !');
                return;
            }

            let teamId = ctx.params.teamId.slice(1);            
            let name = ctx.params.name;
            let comment = ctx.params.comment;

            teamsService.edit(teamId, name, comment)
                .then(function(){
                    notify.showInfo(`Team was updated !`)
                    ctx.redirect('#/catalog');
                });

        })

    });

    app.run();
});