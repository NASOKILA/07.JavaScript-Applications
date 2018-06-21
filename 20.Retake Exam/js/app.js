$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', (ctx) => {
            ctx.redirect('#/login');
        });

        this.get('/', (ctx) => {
            ctx.redirect('#/login');
        });

        this.get('#/login', (ctx) => {

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('../templates/views/loginView.hbs');
            })
        })

        this.post('#/login', (ctx) => {
          
            let username = ctx.params.username;
            let password = ctx.params.pass;

            auth.login(username, password)

                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('Login successful.');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);

        })

        this.get('#/register', (ctx) => {

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('../templates/views/registerView.hbs');
            })
        })

        this.post('#/register', (ctx) => {
            
            let username = ctx.params.username;
            let password = ctx.params.pass;
            let repeatPass = ctx.params.checkPass;


            if(username.length < 5)
            {
                notify.showError('Username should be atleast 5 characters long!');
                return; 
            }

            if(password === '' || repeatPass === '')
            {
                notify.showError('Passwords sould not be empty!');
                return; 
            }

            if(repeatPass !== password)
            {
                notify.showError('Passwords should match !');
                return; 
            }

            let flights = {};
            auth.register(username, password, flights)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('User registration successful!');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo('Logout successful');
                    ctx.redirect('#/login');
                })
                .catch(notify.handleError);
        });

        this.get('#/home', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            flightService.getPublishedFlights()
                .then((flights) => {

                    ctx.flights = flights;

                    flights.forEach(flight => {
                        ctx.flight = flight;
                        
                        ctx.loadPartials({
                            nav: './templates/common/nav.hbs',
                            footer: './templates/common/footer.hbs',
                            flight: './templates/flights/flight.hbs'
                        }).then(function () {
                            this.partial('../templates/views/homeView.hbs');
                        })
                    });

                    if(flights.length < 1)
                    {
                        ctx.noFlights = true;

                        ctx.loadPartials({
                            nav: './templates/common/nav.hbs',
                            footer: './templates/common/footer.hbs'
                        }).then(function () {
                            this.partial('../templates/views/homeView.hbs');
                        })
                    }
                })

          
        });

        this.get('#/add/flight', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('../templates/views/addFlightView.hbs');
            })
        });
    
        this.post('#/add/flight', (ctx) => {

            let destination = ctx.params.destination;
            let origin = ctx.params.origin;
            let departureDate = ctx.params.departureDate;
            let departureTime = ctx.params.departureTime;
            let seats = ctx.params.seats;
            let cost = ctx.params.cost;
            let img = ctx.params.img;
            let public = ctx.params.public;

            if(destination === '')
            {
                notify.showError('Destination should not be empty !');
                return; 
            }
            
            if(origin === '')
            {
                notify.showError('Origin should not be empty !');
                return; 
            }

            if(seats === '' || seats === undefined)
            {
                seats = "0";
            }


            if(cost === '' || cost === undefined)
            {
                cost = "0";
            }

            let seatsNumber = Number(seats);
            let costNumber = Number(cost);

            if(seatsNumber < 0)
            {
                notify.showError('Number of seats should be positive !');                
                return; 
            }

            if(costNumber < 0)
            {
                notify.showError('Cost number should be positive !');                
                return; 
            }

            if(public === undefined)
            {
                public = 'of';
            }

            flightService.createFlight(destination, origin, departureDate, departureTime, seats, cost, img, public)
                .then(() => {

                    notify.showInfo('Flight Created.');
                    ctx.redirect('#/home');
                });      
        });  
     
        this.get('#/flight/:id', (ctx) => {

            let flightid = ctx.params.id;
            
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            flightService.getFlightById(flightid)
                .then((flight) => {

                    ctx.flight = flight;

                    ctx.isAuthor = sessionStorage.getItem('userId') === flight._acl.creator;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function () {
                        this.partial('../templates/views/flightDetailsView.hbs');
                    })

                });

        });

        this.get('#/edit/:id', (ctx) => {

            let flightid = ctx.params.id;
        
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            flightService.getFlightById(flightid)
                .then((flight) => {

                    ctx.flight = flight;

                    if(flight.isPublished === 'on')
                    {
                        flight.public = 'checked';    
                    }
                    else
                    {
                        flight.public = 'unchecked';    
                    }

                    ctx.isAuthor = sessionStorage.getItem('userId') === flight._acl.creator;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function () {
                        this.partial('../templates/views/editFlightView.hbs');
                    })

                });

        });

        this.post('#/edit/:id', (ctx) => {


            let destination = ctx.params.destination;
            let origin = ctx.params.origin;
            let departureDate = ctx.params.departureDate;
            let departureTime = ctx.params.departureTime;
            let seats = ctx.params.seats;
            let cost = ctx.params.cost;
            let img = ctx.params.img;
            let public = ctx.params.public;

            if(destination === '')
            {
                notify.showError('Destination should not be empty !');
                return; 
            }
            
            if(origin === '')
            {
                notify.showError('Origin should not be empty !');
                return; 
            }

            if(seats === '' || seats === undefined)
            {
                seats = "0";
            }

            if(cost === '' || cost === undefined)
            {
                cost = "0";
            }

            let seatsNumber = Number(seats);
            let costNumber = Number(cost);

            if(seatsNumber < 0)
            {
                notify.showError('Number of seats should be positive !');                
                return; 
            }

            if(costNumber < 0)
            {
                notify.showError('Cost number should be positive !');                
                return; 
            }

            if(public === undefined)
            {
                public = 'of';
            }

            let flightId = ctx.params.id;
            flightService.updateFlight(flightId, destination, origin, departureDate, departureTime, seats, cost, img, public)
                .then(() => {

                    notify.showInfo('Successfully edited flight.');
                    ctx.redirect('#/flight/' + flightId);
                });
        });

        this.get('#/my/flights', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');


            flightService.getMyFlights()
                .then((flights) => {

                    ctx.flights = flights;

                    flights.forEach(flight => {
                        
                        ctx.flightTicket = flight;

                        ctx.loadPartials({
                            nav: './templates/common/nav.hbs',
                            footer: './templates/common/footer.hbs',
                            flightTicket: './templates/flights/flightTicket.hbs'
                        }).then(function () {
                            this.partial('../templates/views/myFlightsView.hbs');
                        })
                    });

                    if(flights.length < 1)
                    {
                        ctx.noFlights = true;

                        ctx.loadPartials({
                            nav: './templates/common/nav.hbs',
                            footer: './templates/common/footer.hbs',
                            flightTicket: './templates/flights/flightTicket.hbs'
                        }).then(function () {
                            this.partial('../templates/views/homeView.hbs');
                        })
                    }

                });

        });
       
        this.get('#/delete/:id', (ctx) => {

            let flightId = ctx.params.id;

            flightService.deleteFlight(flightId)
                .then(() => {
                    notify.showInfo('Flight deleted.');
                    ctx.redirect('#/my/flights');
                });

        });
       
       
            /* 
        

       

        this.get('#/shop', (ctx) => {

            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            productsService.getAllProducts()
                .then((products) => {

                    ctx.products = products;
                    products.forEach((p, i) => {

                        p.price = p.price.toFixed(2).toString();
                        ctx.product = p;
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            product: './templates/views/product.hbs',
                        }).then(function () {
                            this.partial('../templates/views/shopView.hbs');
                        })

                    });
                });
        });

        this.get('#/cart', (ctx) => {

            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            auth.getCurrentUser()
                .then((user) => {

                    let productsInCart = user.cart;
                    ctx.productsInCart = productsInCart;

                    for (p in productsInCart) {

                        let product = productsInCart[p];

                        product.totalPrice = (product.product.price * product.quantity).toFixed(2).toString();


                        ctx.productInCart = product;
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            productInCart: './templates/views/productInCart.hbs',
                        }).then(function () {
                            this.partial('../templates/views/cartView.hbs');
                        })

                    }

                    if (productsInCart === undefined || productsInCart === null) {
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            productInCart: './templates/views/productInCart.hbs',
                        }).then(function () {
                            this.partial('../templates/views/cartView.hbs');
                        })

                    }

                });
        });

        this.get('#/purchase/:id', (ctx) => {

            let productId = ctx.params.id;

            auth.getCurrentUser()
                .then((user) => {

                    if (user.cart === undefined)
                        user.cart = {};

                    let productExists = user.cart[productId] !== undefined;

                    if (productExists) {

                        let currentQuantity = user.cart[productId].quantity;
                        currentQuantity = Number(currentQuantity) + 1;
                        user.cart[productId].quantity = currentQuantity.toString();

                        let cart = user.cart;

                        let id = sessionStorage.getItem('userId');
                        let username = sessionStorage.getItem('username');
                        let name = sessionStorage.getItem('name');


                        productsService.updateUser(id, username, name, cart)
                            .then(() => {
                                notify.showInfo('Product purchased.');
                                ctx.redirect('#/cart');
                            })
                            .catch(notify.handleError);

                    }
                    else {

                        productsService.getProduct(productId)
                            .then((product) => {

                                auth.getCurrentUser()
                                    .then((user) => {


                                        if (user.cart === undefined)
                                            user.cart = {};

                                        let cart = user.cart;

                                        cart[productId] = {
                                            "quantity": "1",
                                            "product": product
                                        };

                                        let id = sessionStorage.getItem('userId');
                                        let username = sessionStorage.getItem('username');
                                        let name = sessionStorage.getItem('name');


                                        productsService.updateUser(id, username, name, cart)
                                            .then(() => {
                                                notify.showInfo('Product purchased.');
                                                ctx.redirect('#/cart');
                                            })
                                            .catch(notify.handleError);

                                    })

                            });




                    }
                })
        });

        this.get('#/discart/:id', (ctx) => {

            let productId = ctx.params.id;

            auth.getCurrentUser()
                .then((user) => {

                    let currentProduct = user.cart[productId];
                    let cart = user.cart;

                    delete user.cart[productId];

                    let id = sessionStorage.getItem('userId');
                    let username = sessionStorage.getItem('username');
                    let name = sessionStorage.getItem('name');

                    productsService.updateUser(id, username, name, cart)
                        .then(() => {
                            notify.showInfo('Product purchased.');
                            ctx.redirect('#/cart');
                        })
                        .catch(notify.handleError);
                })
                .then(function () {
                    ctx.redirect('#/cart');
                })
        });
*/
    });

    app.run();
});