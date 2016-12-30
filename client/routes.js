var app = angular.module('bastion', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/form.html'
  })
  .when('/confirm', {
    templateUrl: 'partials/confirm.html'
  })
  .otherwise({
    redirectTo: '/'
  })
})
