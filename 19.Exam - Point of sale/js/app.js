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

                        receiptService.createReceipt(true, 0, 0)
                            .then((res) => {

                                sessionStorage.setItem('receiptId', res._id);
                                ctx.redirect('#/home');
                            });


                    })
                    .catch(notify.handleError);
            }
            else if (form === 'login-form') {

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

                let productCount = ctx.params.productCount;
                let receiptId = ctx.params.receiptId;
                let total = ctx.params.total;

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

    });

    app.run();
});