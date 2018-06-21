

//Tova e service fail zanimavasht se samo s Login, Logout, i Register
//Pak shte polzvame sushtiq REVEALING MODULE PATTERN
//SHTE POLZVAME 'remote.js' FAILA ZATOVA V 'app.js' TRQBVA PURVO NEGO DA ZAREDIM

let auth = (function(){


    //Proverqva dali sme authentikirani ili ne 
    //shte si q iznese za da mojem da q polzvame otvun
    function isAuth(){
        return localStorage.getItem('authtoken') !== null;
    }

    //Tova se sluchva kogato se lognem, zapazvat se 'authtoken', 'username' i 'Id' v localStorage ili sessionStorage !!! 
    function saveSession(userData){
        //Shte zapazim sesiqta v localStorage no moje i v sessionStorage
        //Po princim se pravi s biskvitki

        //setvame authtoken
        localStorage.setItem('authtoken', userData._kmd.authtoken);
    
        //setvame username
        localStorage.setItem('username', userData.username);

        //setvame Id
        localStorage.setItem('userId', userData._id);

    }

    function clearSession(){
        localStorage.clear();
    }

    function register(username, password){

        //registriraneto stawa s 'POST' zaqvka, polzvame 'remote' !!!
        //Pri registraciq logvane i logoutvane modula e vinagi 'user'
        //endpointa vinagi e prazen pri registraciq
        
        //autentikaciqta e 'basic' i data obekta e {username, password}
        let dataObj = { username, password };

        remote.post('user', '', 'basic', dataObj) //tova e zaqvka, znachi vrushta promise, s.l. mojem da polzvame .then()
            .then(saveSession)
            .catch(console.error); 
        //sled registraciqta izvikvame saveSession koqto ni zapazva dannite v localStorage i sme lognali. 
        //ideqta e sled registraciq da se logva avtomatichno.
        //ako iam greshka q printirame na konzolata
    }

    function login(username, password){

        //tuk razliata e che nakraq na linka poluhavame '/login' znachi nashiq 'endpoint' e '/login'
        let authObj = { username, password };
        remote.post('user', 'login', 'basic', authObj)
            .then(saveSession)
            .catch(console.error);
    }
    
    function logout(){
        
        //authentikaciqta tuk e 'kinvey' no moje i da go ostavim prazno to shte si vlezne v 'else'
        //i endPointa ni e '_logout' no moje i da e samo 'logout' BEZ '_' !!!!! 
        //hubAVOTO E CHE NQMAME DATA
        remote.post('user', 'logout', 'kinvey')
        .then(function(res){
             //Ako vsichko e ok, izvikvame si napravenata ot nas funkciq clearSession() 
             //koqto iztriva vsichko ot localStorage.
            clearSession();
        })
        .catch(console.error)
    }


    //Vrushtame samo tezi funkcii koito shte polzvame otvun, vkluchitelno i isAuth().
    return {
        isAuth, 
        register,
        login,
        logout
    }

})();









