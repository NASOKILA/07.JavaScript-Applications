


let messagesService = (() => {



    function getMyMessages() {
        let username = sessionStorage.getItem('username');
        const endpoint = `messages?query={"recipient_username":"${username}"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }
    
    function getSentArchiveMessages() {
        let username = sessionStorage.getItem('username');
        const endpoint = `messages?query={"sender_username":"${username}"}`;
        
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function sendMessage(sender_username, sender_name, recipient_username, text) {
        let data = { sender_username, sender_name, recipient_username, text };

        return remote.post('appdata', 'messages', 'kinvey', data);
    }

    function deleteMessage(messageId) {
        const endpoint = `messages/${messageId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }

    return {
        getMyMessages,
        getSentArchiveMessages,
        deleteMessage,
        sendMessage
    }

})();