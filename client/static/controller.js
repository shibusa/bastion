var app = angular.module('bastion', []);

app.controller('bastionctrl', function($http, $scope, $location){

  $scope.clusters = {}
  $http.get('/hosts').then(function(response){
    $scope.clusters = response.data
    // console.log($scope.clusters)
  })

  $scope.deployaction = function(){
    var reqdata = {}

    $scope.deploy.hosts.forEach(function(item){
      reqdata[item.type] = {"hosts":[]}
    })

    $scope.deploy.hosts.forEach(function(item){
        if(reqdata[item.type].hosts.indexOf(item.value.toString()) == -1){
          reqdata[item.type].hosts = reqdata[item.type].hosts.concat(item.value)
        }
    })

    $http.post('/deploy', {"data":reqdata, "input":$scope.deploy.input})
  }
})
