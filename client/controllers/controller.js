app.controller('bastionctrl', function($http, $scope, $location){

  $scope.clusters = {}
  $scope.reqdata = {}
  $http.get('/hosts').then(function(response){
    $scope.clusters = response.data
  })

  $scope.deploy = function(){
    // Simplify data
    $scope.deploy.hosts.forEach(function(item){
      $scope.reqdata[item.type] = {"hosts":[]}
    })

    $scope.deploy.hosts.forEach(function(item){
        if($scope.reqdata[item.type].hosts.indexOf(item.value.toString()) == -1){
          $scope.reqdata[item.type].hosts = $scope.reqdata[item.type].hosts.concat(item.value)
        }
    })
    $location.url("/confirm")
  }

  $scope.confirm = function(bool){
    if(bool){
      $http.post('/deploy', {"data":$scope.reqdata, "input":$scope.deploy.input})
    }
    $location.url("/")
  }
})
