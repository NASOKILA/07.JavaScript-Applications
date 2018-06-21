

let chirpService = (() => {

    function getAllChirps(subs) {
                                
        const endpoint = `chirps`;
        return remote.get('appdata', endpoint, 'kinvey');
    }
    
    function createChirp(text, author) {
        let data = { text, author };
        return remote.post('appdata', 'chirps', 'kinvey', data);
    }

    function deleteChirp(chirpId) {
        const endpoint = `chirps/${chirpId}`;
        return remote.remove('appdata', endpoint, 'kinvey');
    }

    function userChirpsSorted(username){
        const endpoint = `chirps?query={"author":"${username}"}&sort={"_kmd.ect": 1}`;
        return remote.get('appdata', endpoint, 'kinvey');    
    }

    function countUserChirps(username){
        const endpoint = `chirps?query={"author":"${username}"}`;
        return remote.get('appdata', endpoint, 'kinvey');    
    }

    function countFollowing(username){
        const endpoint = `?query={"username":"${username}"}`;
        return remote.get('user', endpoint, 'kinvey');            
    }

    function countFollowers(username){
        const endpoint = `?query={"subscriptions":"${username}"}`;
        return remote.get('user', endpoint, 'kinvey');            
    }

    function follow(userId){

    }

    function unfollow(userId){

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
    
    return {
        getAllChirps,
        createChirp,
        deleteChirp,
        userChirpsSorted,
        countUserChirps,
        countFollowing,
        countFollowers,
        calcTime
    }

})();


