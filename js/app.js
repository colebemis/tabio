(function (window, angular, undefined) {
  'use strict';

  var app = angular.module('tabio', []);

  app.factory('getTabs', ['$q', function ($q) {
    var deferred = $q.defer();

    chrome.tabs.query({currentWindow: true}, function (tabs) {
      deferred.resolve(tabs);
    });

    return deferred.promise;
  }]);

  app.controller('MainController', ['$scope', '$q', '$filter', 'getTabs',
    function($scope, $q, $filter, getTabs) {
      getTabs.then(function (tabs) {
        $scope.tabs = tabs;
      });

      $scope.mouse = true;

      $scope.matches = function () {
        var tab = $filter('filter')($scope.tabs, $scope.search);
        return tab.length;
      };

      $scope.goto = function (id) {
        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
          if ($scope.tabs[i].active === true) {
            window.close();
          }
        }

        chrome.tabs.update(id, {active: true});
      };

      $scope.close = function (id) {
        var index;

        chrome.tabs.remove(id);

        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
          if ($scope.tabs[i].id === id) {
            index = i;
            break;
          }
        }

        $scope.tabs.splice(index, 1);
        $scope.$apply();

        if (index < $scope.tabs.length) {
          $scope.tabs[index].selected = true;
        } else {
          $scope.tabs[index - 1].selected = true;
        }
      };

      $scope.results = function () {
        if ($scope.search) {
          var tabs = $filter('filter')($scope.tabs, $scope.search);

          for (var i = 0, l = tabs.length; i < l; i++) {
            tabs[i].selected = false;
          }

          tabs[0].selected = true;
        } else {
          for (var i = 0, l = $scope.tabs.length; i < l; i++) {
            $scope.tabs[i].selected = $scope.tabs[i].active;
          }
        }
      };

      $scope.mousemove = function (event) {
        if (event.clientX != $scope.x || event.clientY != $scope.y) {
          $scope.mouse = true;
        }

        $scope.x = event.clientX;
        $scope.y = event.clientY;
      };

      $scope.mouseover = function (tab) {
        if ($scope.mouse) {
          for (var i = 0, l = $scope.tabs.length; i < l; i++) {
            $scope.tabs[i].selected = false;
          }

          tab.selected = true;
        }
      };

      $scope.mouseleave = function () {
        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
          $scope.tabs[i].selected = false;
        }
      }

      $scope.keydown = function (event) {
        var tabs, index, id;

        if ($scope.search) {
          tabs = $filter('filter')($scope.tabs, $scope.search);
        } else {
          tabs = $scope.tabs;
        }

        for (var i = 0, l = tabs.length; i < l; i++) {
          if (tabs[i].selected) {
            tabs[i].selected = false;
            index = i;
            id = tabs[i].id;
            break;
          }
        }

        switch (event.which) {
          case 8: // delete
            if (!$scope.search) {
              $scope.close(id);
            }
            break;

          case 13: // enter
            $scope.goto(id);
            break;

          case 38: // up arrow
            if (index > 0) {
              tabs[index - 1].selected = true;
            } else {
              tabs[tabs.length - 1].selected = true;
            }

            $scope.mouse = false;
            break;

          case 40: // down arrow
            if (index < tabs.length - 1) {
              tabs[index + 1].selected = true;
            } else {
              tabs[0].selected = true;
            }

            $scope.mouse = false;
            break;

          default:
            break;
        }
      };
    }
  ]);

  app.directive('tabs', function (getTabs) {
    function link(scope, element, attrs) {
      getTabs.then(function (tabs) {
        var active;

        for (var i = 0, l = tabs.length; i < l; i++) {
          if (tabs[i].active) {
            active = i;
          }
        }
        var position = (active - 12) * 36 + 18;
        element.animate({scrollTop: position}, 1);
      });

      $(window).on('keydown', function () {
        var offset = $('.selected').offset().top;
        var index = $('.selected').index();

        if (offset < 52) {
          var position = index * 36;
          element.animate({scrollTop: position}, 100);
        } else if (offset > 464) {
          var position = (index - 12) * 36 + 18;
          element.animate({scrollTop: position}, 100);
        }
      });
    }

    return {
      restrict: 'A',
      link: link
    };
  });

})(window, window.angular);
