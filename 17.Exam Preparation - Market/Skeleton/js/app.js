$(() => {
    const app = Sammy('main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/login', (ctx) => {

            let authenticated = auth.isAuth();
            ctx.isAuth = authenticated;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/forms/loginForm.hbs',
            }).then(function () {
                this.partial('./templates/views/loginView.hbs');
            })
        });

        this.post('#/login', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let name = ctx.params.name;

            auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('User login successful.');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('#/register', (ctx) => {

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/forms/registerForm.hbs',
            }).then(function () {
                this.partial('./templates/views/registerView.hbs');
            })
        });

        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let name = ctx.params.name;
            let cart = {};

            auth.register(username, password, name, cart)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('User registration successful!');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);

        });

        this.get('market.html', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('/', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo('User logout successful !')
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('#/home', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.name = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/views/home.hbs');
            })
        });

        this.get('#/shop', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            productService.getAllProducts()
                .then((products) => {

                    ctx.products = products;

                    products.forEach(product => {

                        ctx.product = product;
                        let price = Number(product.price).toFixed('2');
                        product.price = price;

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            product: './templates/product/product.hbs',
                        }).then(function () {
                            this.partial('./templates/views/shopView.hbs');
                        })
                    });
                });

        });

        this.get('#/cart', (ctx) => {

            let cart = JSON.parse(sessionStorage.getItem('cart'));

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            if (Object.keys(cart).length === 0) {
                ctx.empty = true;
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    cartProduct: './templates/product/cartProduct.hbs',
                }).then(function () {
                    this.partial('./templates/views/cartView.hbs');
                })
            }
            else {

                ctx.cart = cart;
                for (const key in cart) {
                    if (cart.hasOwnProperty(key)) {
                        const product = cart[key];

                        let totalPrice = (Number(product.product.price) * Number(product.quantity)).toFixed('2');

                        product.totalPrice = totalPrice;
                        product._id = key;
                        ctx.cartProduct = product;

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            cartProduct: './templates/product/cartProduct.hbs',
                        }).then(function () {
                            this.partial('./templates/views/cartView.hbs');
                        })
                    }
                }

            }

        });

        this.get('#/purchase/:id', (ctx) => {

            let productId = ctx.params.id;

            productService.getProductById(productId)
                .then((product) => {


                    let cart = JSON.parse(sessionStorage.getItem('cart'));


                    if (productId in cart) {
                        //if product already in cart increate the quantity

                        let quantity = Number(cart[productId].quantity);
                        quantity++;
                        cart[productId].quantity = quantity.toString();
                    }
                    else {
                        //if product NOT in cart
                        let newProductObject = {
                            "quantity": "1",
                            "product": {
                                "name": product.name,
                                "description": product.description,
                                "price": product.price.toString()
                            }
                        }

                        cart[productId] = newProductObject;
                    }

                    let userId = sessionStorage.getItem('userId');
                    auth.updateUser(userId, cart)
                        .then(() => {
                            sessionStorage.setItem('cart', JSON.stringify(cart));
                            notify.showInfo('Product purchased!');
                            ctx.redirect('#/cart');
                        });

                });


        });

        this.get('#/discart/:id', (ctx) => {


            let productId = ctx.params.id;


            productService.getProductById(productId)
                .then((product) => {


                    let cart = JSON.parse(sessionStorage.getItem('cart'));


                    if (cart[productId].quantity === "1")
                        delete cart[productId];
                    else {
                        let quantity = Number(cart[productId].quantity);
                        quantity--;
                        cart[productId].quantity = quantity.toString();

                    }

                    let userId = sessionStorage.getItem('userId');
                    auth.updateUser(userId, cart)
                        .then(() => {
                            sessionStorage.setItem('cart', JSON.stringify(cart));
                            notify.showInfo('Product discarted!');
                            ctx.redirect('#/cart');
                        });
                });


        });


    });

    app.run();
});