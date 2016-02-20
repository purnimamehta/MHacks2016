var mod = angular.module('snatch-and-go', []);

function mainController ($scope, $http) {
    $scope.orders = {};
    $http.get('/api/orders')
        .success(function (data) {
            console.log(data);
            $scope.orders = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    
    $scope.deleteOrder = function (id) {
        $http.delete('/api/todos/' + id)
            .success(function (data) {
                $scope.orders = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
}