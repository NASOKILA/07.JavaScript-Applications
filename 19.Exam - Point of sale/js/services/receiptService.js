

let receiptService = (() => {

    function getActiveReceipt() {
        let userId = sessionStorage.getItem('userId');
        let endpoint = `receipts?query={"_acl.creator":"${userId}","active":"true"}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getEntriesByReceipt(receiptId){
        let endpoint = `entries?query={"receiptId":"${receiptId}"}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function createReceipt(active, productCount, total)
    {
        let data = {active, productCount, total};
        return remote.post('appdata', 'receipts', 'kinvey', data);
    }

    function receiptDetails(receiptId)
    {
        let endpoint = 'receipts/' + receiptId;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function updateReceipt(active, productCount, total, receiptId)
    {
        const endpoint = `receipts/${receiptId}`;
        let data = {active, productCount, total};

        return remote.update('appdata', endpoint, 'kinvey', data);
    }

    function getMyReceipts() {
        let userId = sessionStorage.getItem('userId');
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }


    return {
        getActiveReceipt,
        getEntriesByReceipt,
        createReceipt,
        receiptDetails,
        updateReceipt,
        getMyReceipts
    }

})();


