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
                    if ($scope.numOfChecked == $scope.numOfChildren && !$scope.deleted) {    
                        $scope.deleted = true;
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
                        $http.get('/api/sendSms/:'+"+1"+phone_number+"/:"+name+"/:"+stringItems)
                            .success(function(success) {
                                console.log(success);
                            })
                            .error(function(error) {
                                console.log(error);    
                            });
                        $scope.orderListRef.parent().set(null);
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
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}

mod.controller("mainController",  function($scope, $http, $firebaseArray, $document) {
    $scope.table = $firebaseArray(ref);
    $scope.loggedIn = false;
    
    $scope.submit = function () {
        
        ref.authWithPassword({
        email : document.getElementById('email').value,
        password: document.getElementById('password').value
    }, function (error, authData) {
        if (error) {
            document.getElementById('warning').textContent = "Incorrect credentials";
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully!", authData);
            $scope.loggedIn = true;
            $scope.currLocation = authData.password.email.split("@")[0];
            $scope.$apply();
        }
    });
    }
    
    $scope.logout = function () {
        ref.unauth();
        $scope.loggedIn = false;
    }
});

