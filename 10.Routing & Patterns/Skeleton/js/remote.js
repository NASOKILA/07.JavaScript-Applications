
/*
    V tozi fail shte napravim skelet koito da prashta zaqvki kum
    kinvey s nash si AppKey i AppSecret.
    Nqma da prashtame zaqvki direktno, vinagi shte minavame oprez tozi fail
*/

//Shte prilojim Revealing module pattetn koito predstavlqva edno iife
//Koeto vrushta obekt ot funkcii
let remote = (function(){

    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_HyTtz0MoM';
    const APP_SECRET = 'be4c1a39d2f7460caef1f565f7fd8f1e';



    //funkciq koqto ni suzdava autentikaciqta 
    function makeAuth(auth)
    {
        if(auth === 'basic')
        {
            //Ako e 'basic' vsuhtame obekta jelan ot kinvey
            return `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`;
        } 
        else
        {
            //ako NE e 'basic' vrustha 'Basic' + authoken-a ot locationStorage ili ot sessionStorage
            return `Kinvey ${localStorage.getItem('authtoken')}`;
        }
    }



    //Method GET, POST, PUT

    //KYNVEY_MODULE moje da e 'user' ili 'appdata'.
    //Pri registraciq logvane i logoutvane modula e vinagi 'user'
    //url endpoing
    //authentications
    function makeRequest(method, module, endpoint, auth)
    {
        //Tazi funkciq suzdava requesti kum kinvey bazata ni v zavisimost kakvo i podadem kato parametur.
        return {
            method : method,
            url : BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            headers : {
                'Authorization' : makeAuth(auth) //suzdavame autorizaciata
            } 
        }
    }


    //funkciq za get zaqvki
    function get(module, endpoint, auth){

        //suzdavame zaqvka s podadenite parametri i q vrushtame
        let requestObj = makeRequest('GET', module, endpoint, auth);
        return $.ajax(requestObj);
    }

    //funkciq za post zaqvki
    function post(module, endpoint, auth, data){

        //tuk imame i data.
        
        //vzimame si zaqvkata i zakachame podadenata data.
        let requestObj = makeRequest('POST', module, endpoint, auth);

        //AKO 'data' E 'undefined' ZNACHI TOVA E Logout ZQVKA ZASHTOTO TAM NQMA 'data' !!!!
        //Ako e razlicno ot undefined znachi imame data i q setvame.
        if(data !== undefined)
        {
            requestObj.data = data;    // MOJE DA E : JSON.stringify(data);
        }

        
        return $.ajax(requestObj);
    }

    
    //funkciq za PUT zaqvki
    function update(module, endpoint, auth, data){

        let requestObj = makeRequest('PUT', module, endpoint, auth);
        requestObj.data = data;    // MOJE DA E : JSON.stringify(data);
        
        return $.ajax(requestObj);
    }
    

    function remove(module, endpoint, auth){

        let requestObj = makeRequest('DELETE', module, endpoint, auth);
        return $.ajax(requestObj); 
    }



    //VAJNO!!!!!
    //Vrushtame samo funkciite koito sa ni nujni otvunka
    return {
        get,
        post,
        update,
        remove
    }

}());



