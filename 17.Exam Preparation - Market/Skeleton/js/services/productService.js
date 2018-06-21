let productService = (() => {


    function getAllProducts() {
        const endpoint = 'products';

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getProductById(productId) {
        const endpoint = `products/${productId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }


    return {
        getAllProducts,
        getProductById
    }

})();