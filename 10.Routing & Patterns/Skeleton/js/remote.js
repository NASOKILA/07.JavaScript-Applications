
let remote = (function () {

    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_HyTtz0MoM';
    const APP_SECRET = 'be4c1a39d2f7460caef1f565f7fd8f1e';


    function makeAuth(auth) {
        if (auth === 'basic') {
            return `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`;
        }
        else {
            return `Kinvey ${localStorage.getItem('authtoken')}`;
        }
    }



    function makeRequest(method, module, endpoint, auth) {
        return {
            method: method,
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            headers: {
                'Authorization': makeAuth(auth)
            }
        }
    }

    function get(module, endpoint, auth) {

        let requestObj = makeRequest('GET', module, endpoint, auth);
        return $.ajax(requestObj);
    }

    function post(module, endpoint, auth, data) {

        let requestObj = makeRequest('POST', module, endpoint, auth);
        if (data !== undefined) {
            requestObj.data = data;
        }

        return $.ajax(requestObj);
    }


    function update(module, endpoint, auth, data) {

        let requestObj = makeRequest('PUT', module, endpoint, auth);
        requestObj.data = data;

        return $.ajax(requestObj);
    }


    function remove(module, endpoint, auth) {

        let requestObj = makeRequest('DELETE', module, endpoint, auth);
        return $.ajax(requestObj);
    }


    return {
        get,
        post,
        update,
        remove
    }

}());

