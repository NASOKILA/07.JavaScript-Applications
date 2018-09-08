
let auth = (function () {


    function isAuth() {
        return localStorage.getItem('authtoken') !== null;
    }

    function saveSession(userData) {
        localStorage.setItem('authtoken', userData._kmd.authtoken);

        localStorage.setItem('username', userData.username);

        localStorage.setItem('userId', userData._id);
    }

    function clearSession() {
        localStorage.clear();
    }

    function register(username, password) {

        let dataObj = { username, password };

        remote.post('user', '', 'basic', dataObj)
            .then(saveSession)
            .catch(console.error);
    }

    function login(username, password) {

        let authObj = { username, password };
        remote.post('user', 'login', 'basic', authObj)
            .then(saveSession)
            .catch(console.error);
    }

    function logout() {

        remote.post('user', 'logout', 'kinvey')
            .then(function (res) {
                clearSession();
            })
            .catch(console.error)
    }

    return {
        isAuth,
        register,
        login,  
        logout
    }

})();
