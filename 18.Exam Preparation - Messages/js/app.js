$(() => {
    const app = Sammy('main', function () {
        this.use('Handlebars', 'hbs');

        this.get('messages.html', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('/', (ctx) => {
            ctx.redirect('#/home');
        });

        this.get('#/login', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

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
                    notify.showInfo('User login successful!');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);

        });

        this.get('#/register', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

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
            let name = ctx.params.name;

            auth.register(username, password, name)
                .then((userData) => {
                    auth.saveSession(userData);
                    notify.showInfo('User registration successful!');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);

        });

        this.get('#/logout', (ctx) => {
            sessionStorage.clear();
            notify.showInfo('User logout successful !');
            ctx.redirect('#/home');
        });

        this.get('#/home', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.name = sessionStorage.getItem('name');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/views/homeView.hbs');
            })
        });

        this.get('#/myMessages', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.name = sessionStorage.getItem('name');

            //my messages
            messagesService.getMyMessages()
                .then((messages) => {
                    ctx.messages = messages;

                    messages.forEach(message => {
                        ctx.message = message;

                        message.formatSender = formatSender(message.sender_name, message.sender_username);
                        message.date = formatDate(message._kmd.ect);
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            message: './templates/message/message.hbs'
                        }).then(function () {
                            this.partial('./templates/views/myMessagesView.hbs');
                        })

                    });

                    if (messages.length < 1) {
                        ctx.noMessages = true;
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            message: './templates/message/message.hbs'
                        }).then(function () {
                            this.partial('./templates/views/myMessagesView.hbs');
                        })
                    }
                });


        });

        this.get('#/archive', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.name = sessionStorage.getItem('name');

            //my messages
            messagesService.getSentArchiveMessages()
                .then((messages) => {

                    ctx.messages = messages;

                    messages.forEach(message => {

                        ctx.message = message;
                        message.date = formatDate(message._kmd.ect);

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            archivedMessage: './templates/message/archivedMessage.hbs'
                        }).then(function () {
                            this.partial('./templates/views/archiveView.hbs');
                        })

                    });

                    if (messages.length < 1) {
                        ctx.noMessages = true;
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            archivedMessage: './templates/message/archivedMessage.hbs'
                        }).then(function () {
                            this.partial('./templates/views/archivevIEW.hbs');
                        })
                    }
                });
        });

        this.get('#/delete/:id', (ctx) => {

            let messageId = ctx.params.id;

            messagesService.deleteMessage(messageId)
                .then(() => {
                    notify.showInfo('Message deleted!');
                    ctx.redirect('#/archive');
                });
        });

        this.get('#/sendMessage', (ctx) => {

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.name = sessionStorage.getItem('name');

            auth.getAllUsers()
                .then((users) => {

                    ctx.users = users;
                    
                    users.forEach(user => {
                        
                        ctx.optionMessage = `<option value="${user.username}">${user.name}</option>`;   
                        
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            optionMessage: './templates/message/optionMessage.hbs',
                        }).then(function () {
                            this.partial('./templates/views/sendMessageView.hbs');
                        })
                    
                    });


                
                });


        });

        this.post('#/sendMessage', (ctx) => {
            
            let sender_username = sessionStorage.getItem('username');
            let sender_name = sessionStorage.getItem('name');
            let recipient_username = ctx.params.recipient;
            let text = ctx.params.text;

            messagesService.sendMessage(sender_username, sender_name, recipient_username, text)
                .then(() => {
                    notify.showInfo('Message sent.');
                    ctx.redirect('#/archive');
                });


        });





        function formatDate(dateISO8601) {
            let date = new Date(dateISO8601);
            if (Number.isNaN(date.getDate()))
                return '';
            return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
                "." + date.getFullYear() + ' ' + date.getHours() + ':' +
                padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

            function padZeros(num) {
                return ('0' + num).slice(-2);
            }
        }

        function formatSender(name, username) {
            if (!name)
                return username;
            else
                return username + ' (' + name + ')';
        }

    });

    app.run();
});