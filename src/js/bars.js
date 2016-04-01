require("component-responsive-frame/child");
require("angular/angular.min");

var app = angular.module("h1bvisas",[]);

app.controller("VisaController",["$scope", "$filter", function($scope) {

  $scope.bycompany = bycompany;
  $scope.max_len_workers = 153061;
  $scope.max_len_lcas = 33425;

  $scope.selectedTable = "workers";
  $scope.lastSort = "order1";
  $scope.selectSort = "order1";
  $scope.sortOrder = 1;

  console.log($scope.sortOrder);
  console.log($scope.selectedTable);
  console.log($scope.lastSort);

  $scope.sortTable = function(selectSort) {

    $scope.selectSort = selectSort;

    if ($scope.lastSort == selectSort) {
      $scope.sortOrder *= -1;
    } else {
      $scope.lastSort = selectSort;
      $scope.sortOrder = 1;
    }

    $scope.bycompany.sort(function(a, b) {
      if ($scope.selectedTable == "workers") {
        a = a.order1;
        b = b.order1;
      } else {
        a = a.order2;
        b = b.order2;
      }

      if (a > b) {
        return 1 * $scope.sortOrder;
      } else if (a < b) {
        return -1 * $scope.sortOrder;
      } else if (a == b) {
        return 0;
      }
    });

    console.log($scope.sortOrder);
    console.log($scope.selectedTable);
    console.log($scope.lastSort);

  };

}]);
