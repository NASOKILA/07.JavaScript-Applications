


let flightService = (() => {


    function getPublishedFlights() {
        const endpoint = 'flights?query={"isPublished":"on"}';

        return remote.get('appdata', endpoint, 'kinvey');
    }
    
    function createFlight(destination, origin, departure_date, departure_time, seats, cost, image, isPublished) {
        
        const endpoint = 'flights';
        let data = { destination, origin, departure_date, departure_time, seats, cost, image, isPublished };

        return remote.post('appdata', endpoint, 'kinvey', data);
    }

    function updateFlight(flightId, destination, origin, departure_date, departure_time, seats, cost, image, isPublished) {
        const endpoint = `flights/${flightId}`;
        let data = { destination, origin, departure_date, departure_time, seats, cost, image, isPublished };

        return remote.update('appdata', endpoint, 'kinvey', data);
    }
    

    function deleteFlight(flightId) {
        const endpoint = `flights/${flightId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }


    function flightDetails(flightId) {
        const endpoint = `flights/${flightId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getMyFlights() {
        let user_id = sessionStorage.getItem('userId');
        const endpoint = `flights?query={"_acl.creator":"${user_id}"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getFlightById(flightId) {        
        const endpoint = `flights/${flightId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    return {
        getPublishedFlights,
        createFlight,
        updateFlight,
        deleteFlight,
        flightDetails,
        getMyFlights,
        getFlightById
    }
})();