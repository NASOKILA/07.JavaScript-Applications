

let adsService = (() => {

    function getAllAdvertisements(postId) {
        const endpoint = `advertisements`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

        
    function createAdv(views, linkToImage, price, date, publisher, description, title) {
        const endpoint = 'advertisements';
        let data = { views, linkToImage, price, date, publisher, description, title };

        return remote.post('appdata', endpoint, 'kinvey', data);
    }

        
    function updateAdv(advId, views, linkToImage, price, date, publisher, description, title) {
        const endpoint = 'advertisements/'+ advId;
        let data = { views, linkToImage, price, date, publisher, description, title };

        return remote.update('appdata', endpoint, 'kinvey', data);
    }


    function getAdvById(advId) {
        const endpoint = 'advertisements/'+ advId;
        
        return remote.get('appdata', endpoint, 'kinvey');
    }


    function deleteAdv(advId) {
        const endpoint = `advertisements/${advId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    } 


    return {
        getAllAdvertisements,
        createAdv,
        deleteAdv,
        getAdvById,
        updateAdv
    }

})();