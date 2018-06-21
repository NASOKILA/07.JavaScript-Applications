
let auth = (() => {

    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(userData) {
        sessionStorage.setItem('authtoken', userData._kmd.authtoken);
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('userId', userData._id);
    }


    function register (username, password) {
        
        const endPoint = 'login';
        const authorization = 'basic';
        
        let requestBody = { username, password };

        return remote.post('user', endPoint, authorization, requestBody);
    }

    function login(username, password) {

        const endPoint = 'login';
        const authorization = 'basic';
        let requestBody = { username, password };
        
        return remote.post('user', endPoint, authorization, requestBody)
    }
    
    function logout() {
        const endPoint = '_logout';
        const authorization = 'kinvey';
        return remote.post('user', endPoint, authorization);
    }

    return {
        isAuth,
        login,
        logout,
        register,
        saveSession
    }
})();