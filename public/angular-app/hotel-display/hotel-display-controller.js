angular.module('meanhotel').controller('HotelController',HotelController);

function HotelController($window,$route,$routeParams,hotelDataFactory,AuthFactory,jwtHelper){
    var vm = this;
    var id = $routeParams.id;

    hotelDataFactory.hotelDisplay(id).then(function(response){
        console.log(response)
        vm.hotel = response.data;
        vm.stars = _getStarRating(response.data.stars);
    });

    function _getStarRating(stars){
        return new Array(stars);
    }

    vm.isLoggedIn = function(){
        return AuthFactory.isLoggedIn;
    }

    vm.addReview = function(){
        var token = jwtHelper.decodeToken($window.sessionStorage.token);
        username = token.username;
        var postData = {
            name:username,
            rating:vm.rating,
            review:vm.review
        };
        if(vm.reviewForm.$valid){
            hotelDataFactory.postReview(id,postData).then(function(response){
                if(response){
                    $route.reload();
                }
            }).catch(function(err){
                console.log(err);
            });
        }else{
            vm.isSubmitted = true;
        }
    }
}