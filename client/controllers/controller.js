app.controller('bastionctrl', function(bastionfctr, $http, $scope, $location, $cookies){

  $scope.clusters = {}
  $scope.confirmdata = $cookies.getObject('confirmdata')

  $http.get('/hosts').then(function(response){
    $scope.clusters = response.data
  })

  $scope.deploy = function(){
    bastionfctr.confirm($scope.formdata)
    $location.url("/confirm")
  }

  $scope.confirm = function(bool){
    if(bool){
      $http.post('/deploy', $scope.confirmdata)
    }
    $cookies.remove('confirmdata')
    $location.url("/")
  }
})
