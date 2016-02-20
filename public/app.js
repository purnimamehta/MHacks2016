var ref = new Firebase('https://snatch-and-go.firebaseio.com/');

var getValue = function (key) {
    if (key == null)
        return false;
    return key.$value;
}

var mod = angular.module('snatch-and-go', ['firebase'])
    .directive('orderDirective', function() {
    return {
      restrict: 'E',
      scope: {
        path: '&'
      },
      controller: function($scope, $firebaseArray) {
            $scope.orderListRef = ref.child($scope.path());
            $scope.orderList = $firebaseArray($scope.orderListRef);
            
            $scope.numOfChildren = 0;
            $scope.numOfChecked = 0;
            $scope.orderList.$watch(function(snapshot) {
                /*
                if (snapshot.event == 'child_added') {
                    $scope.numOfChildren++;
                    if (getValue($scope.orderList.$getRecord(snapshot.key)))
                        $scope.numOfChecked++;
                } else if (snapshot.event == 'child_removed') {
                    $scope.numOfChildren--;
                    if (getValue($scope.orderList.$getRecord(snapshot.key)))
                        $scope.numOfChecked--;
                } else {
                    if (getValue($scope.orderList.$getRecord(snapshot.key)))
                        $scope.numOfChecked++;
                    else
                        $scope.numOfChecked--;
                    if ($scope.numOfChecked == $scope.numOfChildren) {
                        console.log("HERE");
                        console.log($scope.orderListParent.$getRecord('name').$value);
                        console.log($scope.orderListParent.$getRecord('phone_number').$value);
                        //$scope.orderListRef.parent().set(null);
                        //console.log($scope.orderList.$getRecord('phone_number').$value);
                        //console.log($scope.orderList.child('items'));
                        //sendSms();
                    }
                }*/
            });
      },
      template:
        '<table class="inner-table" style="width:100%">' +
            '<tr ng-repeat="(item, selected) in orderList">' +
                '<td class="right aligned">' + 
                    '<span ng-class="{checked:selected.$value}" id="orderName">{{orderList.$keyAt(item)}}</span>' +
                    '<input type="checkbox" ' +
                        'ng-change="orderList.$save(item)" ' +
                        'ng-model="selected.$value">' +
                '</td>' +
            '</tr>' +
        '</table>',
      replace: true
    };
  });


mod.controller("mainController",  function($scope, $http, $firebaseArray) {
    $scope.table = $firebaseArray(ref);
});

