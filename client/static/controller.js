var app = angular.module('bastion', []);

app.controller('bastionctrl', function($http, $scope, $location){
  $scope.clusters = {}
  $http.get('/hosts').then(function(response){
    $scope.clusters = response.data
    console.log($scope.clusters)
  })

  $scope.deployaction = function(){
    var reqdata = {}
    console.log($scope.deploy)
    // $http.post('/deploy', $scope.deploy).then(function(response){
    //   console.log(response)
    // })
    // $http.post('/deploy', $scope.deploy)
  }
})
