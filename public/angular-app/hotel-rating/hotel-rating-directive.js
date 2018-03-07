// angular.module('meanhotel').directive('hotelRating',hotelRating);

// function hotelRating(){
//     return{
//         restrict:'E',
//         templateUrl: 'angular-app/hotel-display/stardisplay.html',
//         bindToController:true,
//         controller:'HotelController',
//         controllerAs:'vm',
//         scope:{
//             stars:'@'
//         }
//     }
// }

angular.module('meanhotel').component('hotelRating',{
    bindings:{
        stars:'='
    },
    templateUrl:'angular-app/hotel-display/stardisplay.html',
    controller:'HotelController',
    controllerAs:'vm'
});