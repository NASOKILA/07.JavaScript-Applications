$(() => {

    const app = Sammy('#container', function () {
        
        this.use('Handlebars', 'hbs');

        this.get('#/home', getWelcomePage);
        
        this.get('index.html', getWelcomePage);

        this.post('#/register', (ctx) => {
            
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            //pravim si proverkata
            if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
            } else if (repeatPass !== password) {
                notify.showError('Passwords must match!');
            } else {

                //ako vsichko mine dobre gregistrirame user polzvaiki  'auth'
                auth.register(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('User registration successful!');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            }
        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;

            if (username === '' || password === '') {
                notify.showError('All fields should be non-empty!');
            } 
            else {
                auth.login(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('Login successful.');
                        ctx.redirect('#/catalog');
                    })
                    .catch(function(err){
                        console.log(notify);
                        notify.handleError(err);
                    }) 
            }
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo("Logout successful!");
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.get('#/catalog', (ctx) => {
            
            //ako ne sme lognati se vrushtame v 'home'
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            posts.getAllPosts()
                .then((posts) => {
                    //vzimame postovete i za vseki post zakachame rank, date, isAuthor PROMENLIVI
                    posts.forEach((p, i) => {
                        p.rank = i + 1; //ranka zapochva ot 0 zatova mu dobvqme  1
                        p.date = calcTime(p._kmd.ect); //polzvame si dadenata funkciq za da ni presmqta datata
                        p.isAuthor = p._acl.creator === sessionStorage.getItem('userId'); //dali sme nie avtorite na tozi post
                       
                    });

                    //zakachame si za kontexta dali sme  
                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.posts = posts;

                    //zarejdame si vsichki partial templeiti
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
           
            if(!auth.isAuth())
            {
                redirect('#/home')
                return;
            }

            //ako sme lognati nali iskame gore vdqsno da ni pokazva username-a i 'logout' butonche
            //zatova zakachame  isAuth i username kum kontexta
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

            if(!auth.isAuth())
            {
                ctx.redirect("#/catalog");
                return;
            }

            let url = ctx.params.url;
            let title = ctx.params.title;
            let imageUrl = ctx.params.image;
            let description = ctx.params.description;

            let author = sessionStorage.getItem('username');


            //Proverqvame dali nqma prazni poleta
            if(url === '')
                notify.showError('Url is required !');
            else if(!url.startsWith('http'))
                notify.showError('Url must start with "http" !');
            else if(title === '')
                notify.showError('Title is required!');                
            else 
            {

            posts.createPost(author, title, description, url, imageUrl)
                .then(function(){
                    notify.showInfo('Post Created');
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
                    //kogato si vzemem posta chrez funkciqta .getPostById(postId) 

                    //si zakachame slednite neshta
                    ctx.isAuth = auth.isAuth(),
                    ctx.username = sessionStorage.getItem('username'),
                    ctx.post = post //zakachame i posta


                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                    }).then(function(){
                        this.partial('./templates/posts/editPostPage.hbs');
                    })

                });
        });

        this.post('#/edit/post/', (ctx) => {

            //proverqvame dali sme lognati
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            //vzimame si parametrite na posta ot kontexta
            let postId = ctx.params.postId;
            let url = ctx.params.url;
            let title = ctx.params.title;
            let imageUrl = ctx.params.image;
            let description = ctx.params.description;

            //i avtora si vzimame
            let author = sessionStorage.getItem('username');


            //Proverqvame dali noviq post e validen i nqma prazni poleta
            if(url === '')
                notify.showError('Url is required !');
            else if(!url.startsWith('http'))
                notify.showError('Url must start with "http" !');
            else if(title === '')
                notify.showError('Title is required!');                
            else 
            {

            //ako vsichko e nared polzvame .editPost metota koito izprashta PUT zaqvka 
            posts.editPost(postId, author, title, description, url, imageUrl)
                .then(function(){
                    notify.showInfo(`Post ${title} updated`);
                    ctx.redirect('#/catalog');
                })
                .catch(notify.handleError);
            }

        });

        this.get('#/delete/post/:postId', (ctx) => {
            
            if(!auth.isAuth())                
            {
                ctx.redirect('#home');
                return;
            }

            let postId = ctx.params.postId;
            posts.deletePost(postId)
                .then(function(){
                    notify.showError('Post deleted.');
                    ctx.redirect('#/catalog');
            });
            
        });

        this.get('#/posts', (ctx) => {
            
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let username = sessionStorage.getItem('username');

            posts.getMyPosts(username)
                .then((posts) => {
                   
                   posts.forEach((post, i) => {  
                        post.rank = i + 1,
                        post.isAuthor = sessionStorage.getItem('userId') === post._acl.creator,
                        post.date = calcTime(post._kmd.ect)
                    }) 


                    ctx.isAuth = auth.isAuth();
                    ctx.posts = posts;
                    ctx.username = sessionStorage.getItem('username');

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        myPostList: './templates/posts/myPosts/myPostsList.hbs',
                        myPost: './templates/posts/myPosts/myPost.hbs'
                    }).then(function () {
                        this.partial('./templates/posts/myPosts/myPostsPage.hbs');
                    })
                }).catch(notify.handleError);

        });

        this.get('#/details/:postId', (ctx) => {

            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            //vzimame si posIdto ot context-a
            let postId = ctx.params.postId;

            //purvo podavame posta na PostDetails.hbs
            posts.getPostById(postId)
            .then((currentPost) => {
                ctx.post = currentPost
                ctx.isAuthor = sessionStorage.getItem('userId') === ctx.post._acl.creator;
                
            });
            //vzimame vsichki komentari za tozi post
            comments.getPostComments(postId)
                .then((comments) => {
                    
                    //zakachame za vseki komentar tova koeto templeita iska
                    comments.forEach((comm, i) => {
                        comm.date = calcTime(comm._kmd.ect);
                        comm.commentAuthor = comm._acl.creator === sessionStorage.getItem('userId')
                    })

                    
                    //zakachame za kontexta tova koeto im e nujno na drugite templeiti
                    ctx.comments = comments;
                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.noComments = comments.length === 0                   
                    
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        postDetails: './templates/details/postDetails.hbs',
                        comment: './templates/details/comment.hbs',
                        post: './templates/posts/post.hbs'
                    }).then(function () {
                        
                        this.partial('./templates/details/postDetailsPage.hbs');
                    })        
                })

        });

        this.post('#/create/comment', (ctx) => {
          
            if(!auth.isAuth())
            {
                ctx.redirect('#home');
                return;
            }

            let postId = ctx.params.postId;
            let content = ctx.params.content;
            
            if(content === '')
            {
                notify.showError('Cannot add empty comment.');
                return;
            }

            let author = sessionStorage.getItem('username');

            comments.createComment(postId, content, author)
                .then(function(){
                    notify.showInfo('Comment Created');
                    ctx.redirect(`#/details/${postId}`);
                })
                .catch(notify.handleError);
            
        });

        this.get('#/comment/delete/:commentId/post/:postId', (ctx) => {
            
            
            let postId = ctx.params.postId;
            let commentId = ctx.params.commentId;
            
            //triem komentara
            comments.deleteComment(commentId)
                .then(function(){
                    notify.showInfo('Comment Deleted');
                    ctx.redirect(`#/details/${postId}`);
                })
                .catch(notify.handleError);
        });

        /*


       

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
        
*/
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
    });

    app.run();
});