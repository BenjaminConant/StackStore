'use strict';

angular.module('stackStoreApp')
  .directive('favorites', function () {
    return {
      templateUrl: 'app/account/profile/favorites/favorites.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });