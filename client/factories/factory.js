app.factory('bastionfctr', function($location, $cookies) {
  var factory = {};


  // Reformatting data to be similar to orignal JSON dictionary form
  factory.confirm = function(formdata){
    var reqdata = {"locations":{}}

    formdata.hosts.forEach(function(item){
      reqdata.locations[item.type] = {"hosts":[]}
    })

    formdata.hosts.forEach(function(item){
        if(reqdata.locations[item.type].hosts.indexOf(item.value.toString()) == -1){
          reqdata.locations[item.type].hosts = reqdata.locations[item.type].hosts.concat(item.value)
        }
    })

    reqdata.sudo = formdata.sudo
    reqdata.input = formdata.input

    $cookies.putObject('confirmdata', reqdata)
  }

  return factory;
});
