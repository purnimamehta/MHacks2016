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
      controller: function($scope, $firebaseArray, $http) {
            $scope.orderListRef = ref.child($scope.path());
            $scope.orderList = $firebaseArray($scope.orderListRef);
            
            $scope.orderListParentRef = $scope.orderListRef.parent();
            $scope.orderListParent = $firebaseArray($scope.orderListParentRef);
          
            $scope.numOfChildren = 0;
            $scope.numOfChecked = 0;
            $scope.deleted = false;
            $scope.orderList.$watch(function(snapshot) {
                if ($scope.deleted)
                    return;
                
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
                        var arrayItems = [];
                        for (var item in $scope.orderListParent.$getRecord('items')) {
                            if (item.indexOf('$') != 0) {
                                arrayItems.push(item);
                            }
                        }
                        var stringItems = "";
                        for (var i = 0; i < arrayItems.length; i++) {
                            if (i == arrayItems.length - 1) {
                                stringItems += arrayItems[i];
                            } else if (i == arrayItems.length - 2) {
                                stringItems += arrayItems[i] + " and ";
                            } else {
                                stringItems += arrayItems[i] + ", ";
                            }
                        }
                        var phone_number = $scope.orderListParent.$getRecord('phone_number').$value;
                        var name = $scope.orderListParent.$getRecord('name').$value;
                    
                        var data = {phone_number: phone_number, name: name, items: stringItems};
                        console.log($scope.deleted);    
                        $http.get('/api/sendSms/:'+"+1"+phone_number+"/:"+name+"/:"+stringItems)
                            .success(function(success) {
                                console.log(success);
                            })
                            .error(function(error) {
                                console.log(error);    
                            });
                        $scope.orderListRef.parent().set(null);
                        $scope.deleted = true;
                    }
                }
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

