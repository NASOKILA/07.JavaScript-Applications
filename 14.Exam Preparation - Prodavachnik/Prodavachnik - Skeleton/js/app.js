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

            //adsService.createComment()

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


        /*
        this.get('#/home', getWelcomePage);
        this.get('index.html', getWelcomePage);

        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            
                auth.register(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('User registration successful!');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            
        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;

            if (username === '' || password === '') {
                notify.showError('All fields should be non-empty!');
            } else {
                auth.login(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('Login successful.');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('#/catalog', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            posts.getAllPosts()
                .then((posts) => {
                    posts.forEach((p, i) => {
                        p.rank = i + 1;
                        p.date = calcTime(p._kmd.ect);
                        p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
                    });

                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.posts = posts;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        postList: './templates/posts/postList.hbs',
                        post: './templates/posts/post.hbs'
                    }).then(function () {
                        this.partial('./templates/posts/catalogPage.hbs');
                    })
                })
                .catch(notify.handleError);
        });

        this.get('#/create/post', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
            }).then(function () {
                this.partial('./templates/posts/createPostPage.hbs');
            })
        });

        this.post('#/create/post', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let author = sessionStorage.getItem('username');
            let url = ctx.params.url;
            let imageUrl = ctx.params.imageUrl;
            let title = ctx.params.title;
            let description = ctx.params.description;

            if (title === '') {
                notify.showError('Title is required!');
            } else if (url === '') {
                notify.showError('Url is required!');
            } else if (!url.startsWith('http')) {
                notify.showError('Url must be a valid link!');
            } else {
                posts.createPost(author, title, description, url, imageUrl)
                    .then(() => {
                        notify.showInfo('Post created.');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/edit/post/:postId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let postId = ctx.params.postId;

            posts.getPostById(postId)
                .then((post) => {
                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.post = post;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                    }).then(function () {
                        this.partial('./templates/posts/editPostPage.hbs');
                    })
                })
        });

        this.post('#/edit/post', (ctx) => {
            let postId = ctx.params.postId;
            let author = sessionStorage.getItem('username');
            let url = ctx.params.url;
            let imageUrl = ctx.params.imageUrl;
            let title = ctx.params.title;
            let description = ctx.params.description;

            if (postIsValid(title, url)) {
                posts.editPost(postId, author, title, description, url, imageUrl)
                    .then(() => {
                        notify.showInfo(`Post ${title} updated.`);
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.showError);
            }
        });

        this.get('#/delete/post/:postId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let postId = ctx.params.postId;

            posts.deletePost(postId)
                .then(() => {
                    notify.showInfo('Post deleted.');
                    ctx.redirect('#/catalog');
                })
                .catch(notify.handleError);
        });

        this.get('#/posts', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            posts.getMyPosts(sessionStorage.getItem('username'))
                .then((posts) => {
                    posts.forEach((p, i) => {
                        p.rank = i + 1;
                        p.date = calcTime(p._kmd.ect);
                        p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
                    });

                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.posts = posts;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        postList: './templates/posts/postList.hbs',
                        post: './templates/posts/post.hbs'
                    }).then(function () {
                        this.partial('./templates/posts/myPostsPage.hbs');
                    });
                })
        });

        this.get('#/details/:postId', (ctx) => {
            let postId = ctx.params.postId;

            const postPromise = posts.getPostById(postId);
            const allCommentsPromise = comments.getPostComments(postId);

            Promise.all([postPromise, allCommentsPromise])
                .then(([post, comments]) => {
                    post.date = calcTime(post._kmd.ect);
                    post.isAuthor = post._acl.creator === sessionStorage.getItem('userId');
                    comments.forEach((c) => {
                        c.date = calcTime(c._kmd.ect);
                        c.commentAuthor = c._acl.creator === sessionStorage.getItem('userId');
                    });

                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.post = post;
                    ctx.comments = comments;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        postDetails: './templates/details/postDetails.hbs',
                        comment: './templates/details/comment.hbs'
                    }).then(function () {
                        this.partial('./templates/details/postDetailsPage.hbs');
                    })
                })
                .catch(notify.handleError);
        });

        this.post('#/create/comment', (ctx) => {
            let author = sessionStorage.getItem('username');
            let content = ctx.params.content;
            let postId = ctx.params.postId;

            if (content === '') {
                notify.showError('Cannot add empty comment!');
                return;
            }

            comments.createComment(postId, content, author)
                .then(() => {
                    notify.showInfo('Comment created!');
                    ctx.redirect(`#/details/${postId}`);
                })
                .catch(notify.showError);
        });

        this.get('#/comment/delete/:commentId/post/:postId', (ctx) => {
            let commentId = ctx.params.commentId;
            let postId = ctx.params.postId;

            comments.deleteComment(commentId)
                .then(() => {
                    notify.showInfo('Comment deleted.');
                    ctx.redirect(`#/details/${postId}`);
                })
                .catch(notify.handleError);
        });

        function getWelcomePage(ctx) {
            if (!auth.isAuth()) {
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    loginForm: './templates/forms/loginForm.hbs',
                    registerForm: './templates/forms/registerForm.hbs',
                }).then(function () {
                    this.partial('./templates/welcome-anonymous.hbs');
                })
            } else {
                ctx.redirect('#/catalog');
            }

        }

        function postIsValid(title, url) {
            if (title === '') {
                notify.showError('Title is required!');
            } else if (url === '') {
                notify.showError('Url is required!');
            } else if (!url.startsWith('https:')) {
                notify.showError('Url must be a valid link!');
            } else {
                return true;
            }

            return false;
        }

        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);
            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }



        */
    });

    app.run();
});