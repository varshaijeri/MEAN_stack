angular.module('meanhotel').factory('hotelDataFactory',hotelDataFactory);

function hotelDataFactory($http){
    return{
        hotelList:hotelList,
        hotelDisplay:hotelDisplay,
        postReview:postReview
    };

    function hotelList(){
        return $http.get('/api/hotels?count=10').then(success).catch(failed);
    }

    function hotelDisplay(id){
        return $http.get('/api/hotels/'+id).then(success).catch(failed);
    }

    function postReview(id,review){
        return $http.post('/api/hotels/'+id+'/reviews',review).then(success).catch(failed);
    }

    function failed(err){
        console.log(err.statusText);
    }
    
    function success(response){
        return response;
    }
}