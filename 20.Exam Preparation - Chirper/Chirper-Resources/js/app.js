
$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('/', (ctx) => {
            ctx.redirect('#/login');
        });

        this.get('/skeleton.html', (ctx) => {
            ctx.redirect('#/login');
        });

        this.get('#/login', (ctx) => {

            ctx.loadPartials({
                header: '/Chirper-Resources/templates/common/header.hbs',
                footer: '/Chirper-Resources/templates/common/footer.hbs',
                loginForm: '/Chirper-Resources/templates/forms/loginForm.hbs'
            }).then(function () {
                this.partial('/Chirper-Resources/templates/views/loginView.hbs');
            })
        });

        this.get('#/register', (ctx) => {

            ctx.loadPartials({
                header: '/Chirper-Resources/templates/common/header.hbs',
                footer: '/Chirper-Resources/templates/common/footer.hbs',
                registerForm: '/Chirper-Resources/templates/forms/registerForm.hbs'
            }).then(function () {
                this.partial('/Chirper-Resources/templates/views/registerView.hbs');
            })
        });

        this.post('#/login', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;


            if (username.length < 5) {
                notify.showError('Username should be atleast 5 characters long!');
                return;
            }

            if (password === '') {
                notify.showError('Passwords should not be empty!');
                return;
            }

            auth.login(username, password)
                .then((userdata) => {
                    auth.saveSession(userdata)
                    notify.showInfo('User login successful!');
                    ctx.redirect('#/home');

                }).catch(notify.handleError);

        });

        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            if (username.length < 5) {
                notify.showError('Username should be atleast 5 characters long!');
                return;
            }

            if (password === '' || repeatPass === '') {
                notify.showError('Passwords should not be empty!');
                return;
            }

            if (password !== repeatPass) {
                notify.showError('Passwords should match!');
                return;
            }

            auth.register(username, password)
                .then((userdata) => {
                    auth.saveSession(userdata);
                    notify.showInfo('User registration successful!');
                    ctx.redirect('#/home');

                }).catch(notify.handleError);

        });

        this.get('#/logout', (ctx) => {

            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo('User logout successful !');
                    ctx.redirect('#/login');
                })
                .catch(notify.handleError);
        });

        this.get('#/home', (ctx) => {

            let username = sessionStorage.getItem('username');
            ctx.username = username;

            chirpService.userChirpsSorted(username)
                .then((myChirps) => {
                    ctx.chirpsCount = myChirps.length;

                    chirpService.countFollowing(username)
                        .then((users) => {

                            let user = users[0];
                            ctx.followingUsersCount = user.subscriptions.length;

                            chirpService.countFollowers(username)
                                .then((followers) => {
                                    ctx.followersCount = followers.length;


                                    //get all chirps
                                    chirpService.getAllChirps()
                                        .then((chirps) => {

                                            ctx.chirps = chirps
                                            chirps.forEach(chirp => {

                                                if (chirp.author === username) {
                                                    chirp.isAuth = true;
                                                }

                                                chirp.days = chirpService.calcTime(chirp._kmd.ect);
                                                ctx.myChirp = chirp;

                                                ctx.loadPartials({
                                                    header: '/Chirper-Resources/templates/common/header.hbs',
                                                    footer: '/Chirper-Resources/templates/common/footer.hbs',
                                                    menu: '/Chirper-Resources/templates/common/menu.hbs',
                                                    createChirpForm: '/Chirper-Resources/templates/forms/createMyChirpForm.hbs',
                                                    chirp: '/Chirper-Resources/templates/chirps/chirp.hbs'
                                                }).then(function () {
                                                    this.partial('/Chirper-Resources/templates/views/homeView.hbs');
                                                })
                                            });

                                            if (chirps.length < 1) {

                                                ctx.noChirps = true;
                                                ctx.loadPartials({
                                                    header: '/Chirper-Resources/templates/common/header.hbs',
                                                    footer: '/Chirper-Resources/templates/common/footer.hbs',
                                                    createChirpForm: '/Chirper-Resources/templates/forms/createChirpForm.hbs',
                                                    menu: '/Chirper-Resources/templates/common/menu.hbs'
                                                }).then(function () {
                                                    this.partial('/Chirper-Resources/templates/views/homeView.hbs');
                                                })
                                            }

                                        });




                                });

                        });

                });

        });

        //create chirp
        this.post('#/home', (ctx) => {

            let text = ctx.params.text;
            let author = sessionStorage.getItem('username');

            if (text === '') {
                notify.showError('Chirp text shouldn’t be empty !');
                return;
            }


            if (text.length > 150) {
                notify.showError('Chirp text shouldn’t contain more than 150 symbols !');
                return;
            }

            chirpService.createChirp(text, author)
                .then((res) => {
                    notify.showInfo('Chirp published.');
                    ctx.redirect('#/home');
                });

        });

        this.get('#/me', (ctx) => {

            let username = sessionStorage.getItem('username');
            ctx.username = username;
            chirpService.userChirpsSorted(username)
                .then((chirps) => {

                    ctx.chirpsCount = chirps.length;
                    ctx.chirps = chirps



                    chirpService.countFollowing(username)
                        .then((users) => {

                            let user = users[0];
                            ctx.followingUsersCount = user.subscriptions.length;
                            
                            chirpService.countFollowers(username)
                                .then((followers) => {
                                    ctx.followersCount = followers.length;

                                    chirps.forEach(chirp => {


                                        if (chirp.author === username) {
                                            chirp.isAuth = true;
                                        }

                                        chirp.days = chirpService.calcTime(chirp._kmd.ect);
                                        ctx.chirp = chirp;

                                        ctx.loadPartials({
                                            header: '/Chirper-Resources/templates/common/header.hbs',
                                            footer: '/Chirper-Resources/templates/common/footer.hbs',
                                            menu: '/Chirper-Resources/templates/common/menu.hbs',
                                            chirp: '/Chirper-Resources/templates/chirps/chirp.hbs',
                                            createMyChirpForm: '/Chirper-Resources/templates/forms/createMyChirpForm.hbs'
                                        }).then(function () {
                                            this.partial('/Chirper-Resources/templates/views/myView.hbs');
                                        })
                                    });

                                    if (chirps.length < 1) {

                                        ctx.noChirps = true;
                                        ctx.loadPartials({
                                            header: '/Chirper-Resources/templates/common/header.hbs',
                                            footer: '/Chirper-Resources/templates/common/footer.hbs',
                                            menu: '/Chirper-Resources/templates/common/menu.hbs',
                                            chirp: '/Chirper-Resources/templates/chirps/chirp.hbs',
                                            createMyChirpForm: '/Chirper-Resources/templates/forms/createMyChirpForm.hbs'
                                        }).then(function () {
                                            this.partial('/Chirper-Resources/templates/views/myView.hbs');
                                        })
                                    }
                                });
                        });

                });

        });

        this.post('#/me', (ctx) => {

            let text = ctx.params.text;
            let author = sessionStorage.getItem('username');

            if (text === '') {
                notify.showError('Chirp text shouldn’t be empty !');
                return;
            }


            if (text.length > 150) {
                notify.showError('Chirp text shouldn’t contain more than 150 symbols !');
                return;
            }

            chirpService.createChirp(text, author)
                .then((res) => {
                    notify.showInfo('Chirp published.');
                    ctx.redirect('#/me');
                });

        });

        this.get('#/delete/:id', (ctx) => {

            let chirpId = ctx.params.id;

            chirpService.deleteChirp(chirpId)
                .then(() => {
                    notify.showInfo('Chirp deleted.');
                    ctx.redirect('#/me');
                })
        });

        this.get('#/discover', (ctx) => {

            auth.getAllUsers()
                .then((users) => {

                    let filteredUsers = [];

                    users.forEach(user => {
                        if (user.username !== sessionStorage.getItem('username'))
                            filteredUsers.push(user);
                    });

                    ctx.users = filteredUsers;

                    filteredUsers.forEach(user => {
                        //ctx.user =  user;
                        chirpService.countFollowers(user.username)
                            .then((followers) => {
                                user.followersCount = followers.length;
                            });
                    });

                    ctx.loadPartials({
                        header: '/Chirper-Resources/templates/common/header.hbs',
                        footer: '/Chirper-Resources/templates/common/footer.hbs',
                        menu: '/Chirper-Resources/templates/common/menu.hbs',
                        userProfileView: '/Chirper-Resources/templates/user/userProfileView.hbs'
                    }).then(function () {
                        this.partial('/Chirper-Resources/templates/views/discoverView.hbs');
                    })

                });

        });

        this.get('#/profile/:id', (ctx) => {

            let userId = ctx.params.id;

            auth.getUserById(userId)
                .then((user) => {

                    let username = user.username;
                    ctx.username = username;
                    ctx.userId = user._id;

                    //proverqvam dali go veche sledvam tozi user
                    let subs = JSON.parse(sessionStorage.getItem('subscriptions'));

                    if (subs.indexOf(username) !== -1)
                        ctx.alreadiFollowing = true;


                    chirpService.userChirpsSorted(username)
                        .then((chirps) => {

                            ctx.chirpsCount = chirps.length;
                            ctx.chirps = chirps


                            chirpService.countFollowing(username)
                                .then((users) => {

                                    let user = users[0];
                                    ctx.followingUsersCount = user.subscriptions.length;

                                    chirpService.countFollowers(username)
                                        .then((followers) => {
                                            ctx.followersCount = followers.length;

                                            chirps.forEach(chirp => {

                                                chirp.days = chirpService.calcTime(chirp._kmd.ect);
                                                ctx.chirp = chirp;

                                                ctx.loadPartials({
                                                    header: '/Chirper-Resources/templates/common/header.hbs',
                                                    footer: '/Chirper-Resources/templates/common/footer.hbs',
                                                    menu: '/Chirper-Resources/templates/common/menu.hbs',
                                                    chirp: '/Chirper-Resources/templates/chirps/chirp.hbs'
                                                }).then(function () {
                                                    this.partial('/Chirper-Resources/templates/views/profileView.hbs');
                                                })
                                            });

                                            if (chirps.length < 1) {

                                                ctx.noChirps = true;
                                                ctx.loadPartials({
                                                    header: '/Chirper-Resources/templates/common/header.hbs',
                                                    footer: '/Chirper-Resources/templates/common/footer.hbs',
                                                    menu: '/Chirper-Resources/templates/common/menu.hbs',
                                                    chirp: '/Chirper-Resources/templates/chirps/chirp.hbs'
                                                }).then(function () {
                                                    this.partial('/Chirper-Resources/templates/views/profileView.hbs');
                                                })
                                            }
                                        });
                                });
                        });
                });
        });

        this.get('#/follow/:id', (ctx) => {

            auth.getUserById(ctx.params.id)
                .then((user) => {

                    let userId = user._id;

                    let username = user.username;
                    let subs = JSON.parse(sessionStorage.getItem('subscriptions'));
                    subs.push(username);
                    auth.updateUser(userId, JSON.stringify(subs))
                        .then(() => {
                            sessionStorage.setItem('subscriptions', JSON.stringify(subs));
                            notify.showInfo(`Subscribed to ${username}`);
                            ctx.redirect('#/profile/' + userId);        
                        });
                });
        });



        this.get('#/unfollow/:id', (ctx) => {

            let userId = ctx.params.id;
            auth.getUserById(userId)
                .then((user) => {

                    let username = user.username;
                    let subs = JSON.parse(sessionStorage.getItem('subscriptions'));
                    
                    auth.updateUser(userId, subs)
                        .then(() => {

                            let index = subs.indexOf(username);
                            if (index > -1) {
                                subs.splice(index, 1);
                            }
                            sessionStorage.setItem('subscriptions', subs);
                            notify.showInfo(`Unsubscribed to ${username}`);
                            ctx.redirect('#/profile/' + userId);
                        });
                });
        });


    });

    app.run();
});