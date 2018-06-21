

let entryService = (() => {

    function addEntry(type, qty, price, receiptId)
    {
        let data = {type, qty, price, receiptId};     
        return remote.post('appdata', 'entries', 'kinvey', data);
    }

    function deleteEntry(entryId)
    {
        let endpoint = "entries/" + entryId;
        return remote.remove('appdata', endpoint, 'kinvey');
    }


    return {
        addEntry,
        deleteEntry
    }

})();

