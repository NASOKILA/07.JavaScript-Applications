$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', (ctx) => {
            ctx.redirect('#/welcome');
        });

        this.get('/', (ctx) => {
            ctx.redirect('#/welcome');
        });

        this.get('#/edit', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('#/welcome', (ctx) => {

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                loginForm: './templates/forms/loginForm.hbs',
                registerForm: './templates/forms/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/views/welcomeView.hbs');
            })

        });

        this.post('#/welcome', (ctx) => {

            let form = ctx.target.id;
            if (form === 'register-form') {

                //register
                let username = $('#username-register').val();
                let password = $('#password-register').val();
                let repeatPassword = $('#password-register-check').val();

                if (username.length < 5) {
                    notify.showError('A username should be a string with at least 5 characters long.');
                    return;
                }
                else if (password === '' || repeatPassword === '') {
                    notify.showError('Passwords input fields shouldn’t be empty.');
                    return;
                }
                else if (password !== repeatPassword) {
                    notify.showError('Passwords should match.');
                    return;
                }

                auth.register(username, password)
                    .then((userData) => {

                        auth.saveSession(userData);
                        notify.showInfo('User registration successful!');

                        //create new ACTIVE receptId
                        receiptService.createReceipt(true, 0, 0)
                            .then((res) => {

                                sessionStorage.setItem('receiptId', res._id);
                                ctx.redirect('#/home');
                            });


                    })
                    .catch(notify.handleError);
            }
            else if (form === 'login-form') {

                //login
                let username = $('#username-login').val();
                let password = $('#password-login').val();

                if (username.length < 5) {
                    notify.showError('A username should be a string with at least 5 characters long.');
                    return;
                }
                else if (password === '') {
                    notify.showError('Passwords input fields shouldn’t be empty.');
                    return;
                }

                auth.login(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('Login successful.');


                        //get active receipt and save it in the sessionStorage
                        receiptService.getActiveReceipt()
                            .then((receipts) => {

                                let receipt = receipts[0];
                                sessionStorage.setItem('receiptId', receipt._id);
                                ctx.redirect('#/home');
                            })

                    })
                    .catch(notify.handleError);

            }

        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    ctx.redirect('#/welcome');
                })
                .catch(notify.handleError);
        });

        this.get('#/home', (ctx) => {

            ctx.username = sessionStorage.getItem('username');

            receiptService.getActiveReceipt()
                .then((activeReceipts) => {

                    let receipt = activeReceipts[0];

                    let total = 0;

                    receiptService.getEntriesByReceipt(receipt._id)
                        .then((entries) => {

                            ctx.entries = entries;
                            ctx.productCount = entries.length;
                            ctx.receiptId = sessionStorage.getItem('receiptId');


                            entries.forEach(entry => {

                                ctx.entry = entry;
                                entry.subTotal = Number(entry.price) * Number(entry.qty);
                                total += entry.subTotal;

                                ctx.total = total;

                                ctx.loadPartials({
                                    header: './templates/common/header.hbs',
                                    footer: './templates/common/footer.hbs',
                                    navigation: './templates/common/navigation.hbs',
                                    createEntryForm: './templates/forms/createEntryForm.hbs',
                                    createReceiptForm: './templates/forms/createReceiptForm.hbs',
                                    entry: './templates/entries/entry.hbs'
                                }).then(function () {
                                    this.partial('./templates/views/homeView.hbs');
                                })

                            });

                            if (entries.length < 1) {

                                ctx.loadPartials({
                                    header: './templates/common/header.hbs',
                                    footer: './templates/common/footer.hbs',
                                    navigation: './templates/common/navigation.hbs',
                                    createEntryForm: './templates/forms/createEntryForm.hbs',
                                    createReceiptForm: './templates/forms/createReceiptForm.hbs',
                                    entry: './templates/entries/entry.hbs'
                                }).then(function () {
                                    this.partial('./templates/views/homeView.hbs');
                                })

                            }

                        })

                    if (receipt.length < 1) {
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            navigation: './templates/common/navigation.hbs',
                            createEntryForm: './templates/forms/createEntryForm.hbs',
                            createReceiptForm: './templates/forms/createReceiptForm.hbs',
                            entry: './templates/entries/entry.hbs'
                        }).then(function () {
                            this.partial('./templates/views/homeView.hbs');
                        })
                    }

                });

        });

        this.post('#/home', (ctx) => {

            let form = ctx.target.id;
            if (form === 'create-entry-form') {
                //create entry

                let type = ctx.params.type;
                let qty = ctx.params.qty;
                let price = ctx.params.price;

                if (type === '') {
                    notify.showError('Product name must be a non-empty string.');
                    return;
                }
                else if (qty === '') {
                    notify.showError('Quantity must be a non-empty string.');
                    return;
                }
                else if (price === '') {
                    notify.showError('Price must be a non-empty string.');
                    return;
                }

                let qtyNum = Number(qty);
                let priceNum = Number(price);

                if (isNaN(qtyNum)) {
                    notify.showError('Quantity must be a number.');
                    return;
                }
                else if (isNaN(priceNum)) {
                    notify.showError('Price must be a number.');
                    return;
                }

                let receiptId = sessionStorage.getItem('receiptId');

                entryService.addEntry(type, qty, price, receiptId)
                    .then((res) => {
                        notify.showInfo('Entry added.');
                        ctx.redirect('#/home');
                    })
            }
            else if (form === 'create-receipt-form') {
                //create receipt


                let productCount = ctx.params.productCount;
                let receiptId = ctx.params.receiptId;
                let total = ctx.params.total;


                //cannot create empty receipt
                if (productCount < 1) {
                    notify.showError('Cannot checkout an empty receipt.');
                    return;
                }

                receiptService.updateReceipt(false, productCount, total, receiptId)
                    .then((res) => {
                        notify.showInfo('Receipt checked out.');


                        receiptService.createReceipt(true, 0, 0)
                            .then((newReceipt) => {
                                sessionStorage.setItem('receiptId', newReceipt._id)
                                ctx.redirect('#/home');
                            })
                    })
            }

        });

        this.get('#/delete/:id', (ctx) => {

            let entryId = ctx.params.id;

            entryService.deleteEntry(entryId)
                .then((res) => {

                    notify.showInfo('Entry removed.');
                    ctx.redirect('#/home');
                }).catch(notify.handleError);

        });

        this.get('#/overview', (ctx) => {

            receiptService.getMyReceipts()
                .then((receipts) => {


                    ctx.username = sessionStorage.getItem('username');
                    ctx.receipts = receipts;

                    let totalOfTotals = 0;

                    receipts.forEach((receipt) => {
                        ctx.receipt = receipt;
                        totalOfTotals += Number(receipt.total);
                        ctx.totalsOfReceipts = totalOfTotals;

                        let date = receipt._kmd.ect.substring(0, 10);
                        let time = receipt._kmd.ect.substr(14, 5);
                        receipt.date = date + ' ' + time;

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            navigation: './templates/common/navigation.hbs',
                            receipt: './templates/receipts/receipt.hbs',
                            createReceiptForm: './templates/forms/createReceiptForm.hbs',
                        }).then(function () {
                            this.partial('./templates/views/allReceiptsView.hbs');
                        })
                    })

                    if (receipts.length < 1) {

                        ctx.noEntries = true;
                        ctx.totalsOfReceipts = 0;

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            navigation: './templates/common/navigation.hbs',
                            receipt: './templates/receipts/receipt.hbs',
                            createReceiptForm: './templates/forms/createReceiptForm.hbs',
                        }).then(function () {
                            this.partial('./templates/views/allReceiptsView.hbs');
                        })
                    }

                })

        });

        this.get('#/details/:id', (ctx) => {

            let id = ctx.params.id;
            ctx.username = sessionStorage.getItem('username');
            receiptService.getEntriesByReceipt(id)
                .then((entries) => {

                    ctx.entries = entries;
                    entries.forEach(entryForDetails => {
                        
                        ctx.entryForDetails = entryForDetails;
                        entryForDetails.subTotal = Number(entryForDetails.qty) * Number(entryForDetails.price);

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            navigation: './templates/common/navigation.hbs',
                            entryForDetails: './templates/entries/entryForDetails.hbs'
                        }).then(function () {
                            this.partial('./templates/views/detailsView.hbs');
                        })
                    })
                })
        });







        /*
      
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