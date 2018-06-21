let posts = (() => {

    //TOZI SERVISE SE ZANIMAVA SAMO S POSTOVETE OT BAZATA

    //vzimame vsichki postove
    function getAllPosts() {
        const endpoint = 'posts?query={}&sort={"_kmd.ect": -1}';

        return remote.get('appdata', endpoint, 'kinvey');
    }
    
    //suzdavame nov post
    function createPost(author, title, description, url, imageUrl) {
        let data = { author, title, description, url, imageUrl };

        return remote.post('appdata', 'posts', 'kinvey', data);
    }

    //editvame posta
    function editPost(postId, author, title, description, url, imageUrl) {
        const endpoint = `posts/${postId}`;
        let data = { author, title, description, url, imageUrl };

        return remote.update('appdata', endpoint, 'kinvey', data);
    }
    
    //triem posta
    function deletePost(postId) {
        const endpoint = `posts/${postId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }

    // vzimame SAMO NASHITE POSTOVE
    function getMyPosts(username) {
        const endpoint = `posts?query={"author":"${username}"}&sort={"_kmd.ect": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    //vzimme daden post po id
    function getPostById(postId) {
        const endpoint = `posts/${postId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    return {
        getAllPosts,
        createPost,
        editPost,
        deletePost,
        getPostById,
        getMyPosts
    }
})();