let teamsController = (() => {

    function loadCatalog(ctx){

        //zakachame si teamovete
        teamsService.loadTeams()
        .then((userData) => {
            
            ctx.loggedIn = auth.isAuthenticated();
            
            ctx.username = auth.getUsername();

            //vzimame samo tezi koito imat memberi
            userData = userData.filter(t => t.members != undefined);
            
            ctx.teams = userData.map(e => {
                return {
                    _id: e._id,
                    name: e.name,
                    comment: e.comment
                }
            });
            

            this.loadPartials({
                header: 'templates/common/header.hbs',
                team: 'templates/catalog/team.hbs',    
                footer: 'templates/common/footer.hbs'
            }).then(function(){
                this.partial('templates/catalog/teamCatalog.hbs');
                              
            })
        })

        
    }


    function loadTeamDetails(ctx){

        let teamId = ctx.params.id.substr(1);
       
        teamsService.loadTeamDetails(teamId)
        .then((details) => {
            
            ctx.loggedIn = auth.isAuthenticated();
            
            ctx.username = auth.getUsername();
            
            ctx.name = details.name;

            //zakachame i Idto na otbora v sluchai che iskame da se joinnem
            ctx.teamId = details._id;
            
            ctx.comment = details.comment;
            
            ctx.isAuthor = details._acl.creator === auth.getUserId();

            ctx.members = details.members == null ? null 
                 : JSON.parse(details.members)
                 .map(username => {

                    if(username === auth.getUsername())
                        ctx.isOnTeam = true;     

                    return {
                        username : username
                    }
             })

             
            this.loadPartials({
                header: 'templates/common/header.hbs',
                team: 'templates/catalog/team.hbs',    
                footer: 'templates/common/footer.hbs',
                teamMember: 'templates/catalog/teamMember.hbs',
                teamControls: 'templates/catalog/teamControls.hbs'
            }).then(function(){
                this.partial('templates/catalog/details.hbs');
            })
        })

    }


    function joinTeam(ctx){
        
        let teamId = ctx.params.teamId.substr(1);
        
        teamsService.joinTeam(teamId).then((details) => {
           
            ctx.loggedIn = auth.isAuthenticated();
            ctx.username = auth.getUsername();

            auth.showInfo('Tou have successfully joined the team!');
            //pak si renderirame strainicata
            
            console.log(details);
            ctx.redirect('#/catalog');            

        });
    }


    return {
        joinTeam,
        loadCatalog,
        loadTeamDetails
    }
})();

