$(() => {
    const app = Sammy('main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/login', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/forms/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/views/loginView.hbs');
            })
        });

        this.post('#/login', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('Login successful.');
                    ctx.redirect('#/viewAds');
                })
                .catch(notify.handleError);

        });

        this.get('#/register', (ctx) => {

            ctx.isAuth = auth.isAuth();

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/forms/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/views/registerView.hbs');
            })


        });

        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            auth.register(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('User registration successful!');
                    ctx.redirect('#/viewAds');
                })
                .catch(notify.handleError);
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo('User logout successful!');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('index.html', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('/', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('#/home', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');



            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/views/homeView.hbs');
            })
        });

        this.get('#/viewAds', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            adsService.getAllAdvertisements()
                .then((ads) => {

                    ctx.ads = ads;
                    ads.forEach(adv => {

                        let isAuthor = sessionStorage.getItem('username') === adv.publisher;

                        adv.isAuthor = isAuthor;

                        adv.price = Number(adv.price).toFixed(2);
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            adv: './templates/ads/adv.hbs'
                        }).then(function () {
                            this.partial('./templates/views/viewAds.hbs');
                        });
                    });
                });

        });

        this.get('#/createAdvertisement', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createAdvForm: './templates/forms/createAdvForm.hbs'
            }).then(function () {
                this.partial('./templates/views/createAdView.hbs');
            })
        });

        this.post('#/createAdvertisement', (ctx) => {

            let title = ctx.params.title;
            let description = ctx.params.description;
            let date = ctx.params.datePublished;
            let price = Number(ctx.params.price);
            let linkToImage = ctx.params.image;
            let views = 0;
            let publisher = sessionStorage.getItem('username');

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            adsService.createAdv(views, linkToImage, price, date, publisher, description, title)
                .then(() => {

                    notify.showInfo('Advertisement created!');
                    ctx.redirect('#/viewAds');

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        createAdvForm: './templates/forms/createAdvForm.hbs'
                    }).then(function () {
                        this.partial('./templates/views/createAdView.hbs');
                    })
                });
        });

        this.get('#/edit/:id', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            adsService.getAdvById(ctx.params.id)
                .then((adv) => {
                    ctx.ad = adv;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        updateAdvForm: './templates/forms/updateAdvForm.hbs'
                    }).then(function () {
                        this.partial('./templates/views/editAdView.hbs');
                    })

                });
        });

        this.post('#/edit', (ctx) => {


            let title = ctx.params.title;
            let description = ctx.params.description;
            let date = ctx.params.datePublished;
            let price = Number(ctx.params.price);
            let linkToImage = ctx.params.imageUrl;
            let views = ctx.params.views;
            let publisher = sessionStorage.getItem('username');
            let advId = ctx.params.id;

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            adsService.updateAdv(advId, views, linkToImage, price, date, publisher, description, title)
                .then(() => {
                    notify.showInfo('Advertisement updated!');
                    ctx.redirect('#/viewAds');
                });
        });

        this.get('#/delete/:id', (ctx) => {

            adsService.deleteAdv(ctx.params.id)
                .then(() => {

                    notify.showInfo('Advertisement deleted!');
                    ctx.redirect('#/viewAds');
                });
        });

        this.get('#/readMore/:id', (ctx) => {


            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            adsService.getAdvById(ctx.params.id)
                .then((adv) => {

                    let title = adv.title;
                    let description = adv.description;
                    let date = adv.datePublished;
                    let price = Number(adv.price);
                    let linkToImage = adv.linkToImage;
                    let views = adv.views;
                    let publisher = sessionStorage.getItem('username');
                    let advId = adv._id;

                    views++;
                    ctx.ad = adv;
                    
                    adsService.updateAdv(advId, views, linkToImage, price, date, publisher, description, title)
                    .then(() => {

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs'
                        }).then(function () {
                            this.partial('./templates/ads/detailsAd.hbs');
                        })
                    });

                });
        });

    });

    app.run();
});