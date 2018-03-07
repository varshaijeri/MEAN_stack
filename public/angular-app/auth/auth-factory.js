angular.module('meanhotel').factory('AuthFactory',AuthFactory);

function AuthFactory(){
    return {
        auth:auth
    }

    var auth = {
        idLoggedIn:false
    };
}