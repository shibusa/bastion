app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            element.bind('change', function(e) {

                var onFileReadFn = $parse(attrs.onReadFile);
                var reader = new FileReader();

                reader.onload = function() {
                    var fileContents = reader.result;
                    scope.$apply(function() {
                        onFileReadFn(scope, {
                            'contents' : fileContents
                        });
                    });
                };
                reader.readAsText(element[0].files[0]);
            });
        }
    };
})
