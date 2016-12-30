app.controller('bastionctrl', function($http, $scope, $location){

  $scope.clusters = {}
  $scope.save = {}

  $http.get('/hosts').then(function(response){
    $scope.clusters = response.data
  })

  $scope.deploy = function(){
    console.log($scope.formdata)
    var reqdata = {}
    // Reformatting data to be similar to orignal JSON dictionary form
    $scope.formdata.hosts.forEach(function(item){
      reqdata[item.type] = {"hosts":[]}
    })

    $scope.formdata.hosts.forEach(function(item){
        if(reqdata[item.type].hosts.indexOf(item.value.toString()) == -1){
          reqdata[item.type].hosts = reqdata[item.type].hosts.concat(item.value)
        }
    })

    // for loop reconstruction
    $location.url("/confirm")
  }

  $scope.confirm = function(bool){
    // if(bool){
    //   $http.post('/deploy', {"data":reqdata, "input":$scope.formdata.input})
    // }
    $location.url("/")
  }
})
