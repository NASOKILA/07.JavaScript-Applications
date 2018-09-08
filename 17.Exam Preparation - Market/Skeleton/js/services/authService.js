let auth = (() => {

    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(userData) {
        console.log(userData);
        sessionStorage.setItem('authtoken', userData._kmd.authtoken);
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('userId', userData._id);
        sessionStorage.setItem('cart', JSON.stringify(userData.cart));
    }

    function register (username, password, name, cart) {
        let obj = { username, password, name, cart };

        return remote.post('user', '', 'basic', obj);
    }

    function login(username, password) {
        let obj = { username, password };

        return remote.post('user', 'login', 'basic', obj)
    }
    
    function logout() {
        return remote.post('user', '_logout', 'kinvey');
    }

    function getAllUsers() {
        return remote.get('user', '', 'kinvey')
    }

    function getCurrentUser()
    {
        let endpoint = sessionStorage.getItem('userId');
        return remote.get('user', endpoint, 'kinvey')
    }

    function getUserById(userId) {
        return remote.get('user', userId, 'kinvey');
    }
    
    function updateUser(userId, cart) {
        let obj = {cart};
        return remote.update('user', userId, 'kinvey', obj);
    }

    return {
        isAuth,
        login,
        getCurrentUser,
        getAllUsers,
        getUserById,
        logout,
        register,
        saveSession,
        updateUser
    }
})();