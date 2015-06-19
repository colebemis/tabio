(function (window, angular, undefined) {
  'use strict';

  var app = angular.module('tabio', ['ng-sortable']);

  app.factory('getTabs', ['$q', function ($q) {
    var deferred = $q.defer();

    chrome.tabs.query({}, function (tabs) {
      deferred.resolve(tabs);
    });

    return deferred.promise;
  }]);

  app.factory('getCurrentWindow', ['$q', function ($q) {
    var deferred = $q.defer();

    chrome.windows.getCurrent({}, function (window) {
      deferred.resolve(window);
    });

    return deferred.promise;
  }]);
  
  app.factory('getAllWindows', ['$q', function ($q) {
    var deferred = $q.defer();
    
    chrome.windows.getAll({}, function (windows) {
      deferred.resolve(windows);
    });
    
    return deferred.promise;
  }]);
  
  app.filter('searchTabs', function () {
    return function (input, search) {

      if (!search) {
        return input;
      }
      
      var result = [];
      /*
      input.forEach(function (array) {
        var filteredTabs = array.filter(function (obj) {
          return obj.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
        
        if (!!filteredTabs.length) {
          result.push(filteredTabs);
        }
      });
      */
      
      for (var i = 0, len = input.length; i < len; i++) {
        var filteredTabs = input[i].filter(function (obj) {
          return obj.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
        
        if (!!filteredTabs.length) {
          result.push(filteredTabs);
        }
      }
      
      return result;
    };
  });

  app.controller('MainController', ['$scope', '$q', '$filter', 'getTabs', 'getCurrentWindow', 'getAllWindows', 'searchTabsFilter',
    function ($scope, $q, $filter, getTabs, getCurrentWindow, getAllWindows, searchTabsFilter) {

      $q.all([getTabs, getCurrentWindow, getAllWindows]).then(function (data) {
        $scope.tabs = data[0];
        $scope.currentWindowId = data[1].id;
        
        /*
        $scope.tabs.forEach(function (tab) {
          if (tab.windowId !== $scope.currentWindowId) {
            tab.selected = false;
            tab.active = false;
          }
        });
        */
        
        for (var index = 0, len = $scope.tabs.length; index < len; index++) {
          // only select active tab in the current window
          if ($scope.tabs[index].windowId !== $scope.currentWindowId) {
            $scope.tabs[index].selected = false;
            $scope.tabs[index].active = false;
          }
        }
        
        
        $scope.windows = [];
        
        /*
        data[2].forEach(function (window) {
          var tabs = [];
          
          $scope.tabs.forEach(function (tab) {
            if (tab.windowId === window.id) {
              tabs.push(tab);
            }
          });
          
          if (window.id === $scope.currentWindowId) {
            $scope.windows.unshift(tabs);
          } else {
            $scope.windows.push(tabs);
          }
        });
        */
        
        for (var i = 0, j = data[2].length; i < j; i++) {
          var tabs = [];
          
          for (var k = 0, l = $scope.tabs.length; k < l; k++) {
            if ($scope.tabs[k].windowId === data[2][i].id) {
              tabs.push($scope.tabs[k]);
            }
          }
          
          if (data[2][i].id === $scope.currentWindowId) {
            $scope.windows.unshift(tabs);
          } else {
            $scope.windows.push(tabs);
          }
        }
        
        
        console.log($scope.windows);
        
        /*
        $scope.windows = data[2];
        $scope.tabsInEachWindow = [];
        
        console.log($scope.windows);
        
        $scope.windows.forEach(function (window) {
          var tabsInWindow = {
            windowId: window.id,
            tabs: 0
          };

          
          $scope.tabs.forEach(function (tab) {
            if (tab.windowId === window.id) {
              tabsInWindow.tabs += 1;
            }
          });
          
          $scope.tabsInEachWindow.push(tabsInWindow);
        });
        */
      });
      
      $scope.noMatches = function () {
        
        if (!$scope.search) {
          return false;
        }
        
//        var result = [];
//      
//        $scope.windows.forEach(function (array) {
//          var filteredTabs = array.filter(function (obj) {
//            return obj.title.toLowerCase().indexOf($scope.search) !== -1;
//          });
//          
//          if (!!filteredTabs.length) {
//            result.push(filteredTabs);
//          }
//        });
        
        var result = searchTabsFilter($scope.windows, $scope.search);
        
        return !result.length;
      };

      $scope.goToTab = function (windowId, id) {
        chrome.tabs.update(id, {active: true});

        if (windowId !== $scope.currentWindowId) {
          chrome.windows.update(windowId, {focused: true});
        }
        
        window.close();
      };

      $scope.close = function (windowId, id) {
        var windowIndex;
        var index;
        
        chrome.tabs.remove(id);

        $scope.windows.forEach(function (window, i) {
          window.forEach(function (tab, j) {
            if (tab.windowId === windowId && tab.id === id) {
              windowIndex = i;
              index = j;
            }
          });
        });
        
        console.log(windowIndex);
        console.log(index);
        
        $scope.windows[windowIndex].splice(index, 1);
        $scope.$apply();
        
        if ($scope.windows[windowIndex].length > 0) {
          console.log('this window isn\'t empty');
          
          if (index < $scope.windows[windowIndex].length) {
            $scope.windows[windowIndex][index].selected = true;
          } else {
            $scope.windows[windowIndex][index - 1].selected = true;
          }
          
        } else if ($scope.windows[windowIndex].length === 0) {
          console.log('this window is empty');
          $scope.windows.splice(windowIndex, 1);
          
          if (windowIndex < $scope.windows.length) {
            $scope.windows[windowIndex][0].selected = true;
          } else {
            $scope.windows[windowIndex - 1][$scope.windows[windowIndex - 1].length - 1].selected = true;
          }
        }
        
//        if ($scope.window[windowIndex].length === 0) {
//          $scope.windows.splice(windowIndex, 1);
//        }
        
//        if (!!$scope.windows[windowIndex] && index < $scope.windows[windowIndex].length) {
//          
//          $scope.windows[windowIndex][index].selected = true;
//          
//        } else if (!!$scope.windows[windowIndex] && index === $scope.windows[windowIndex].length) {
//          
//          $scope.windows[windowIndex][index - 1].selected = true;
//          
//        }
        
//        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
//          if ($scope.tabs[i].id === id) {
//            index = i;
//            break;
//          }
//        }
//
//        $scope.tabs.splice(index, 1);
//        $scope.$apply();
//
//        if (index < $scope.tabs.length) {
//          $scope.tabs[index].selected = true;
//        } else {
//          $scope.tabs[index - 1].selected = true;
//        }
      };

      $scope.unselect = function (input) {
        input.forEach(function (array) {
          array.forEach(function (obj) {
            obj.selected = false;
          });
        });
      };
      
      $scope.results = function () {
        /*
        if ($scope.search.title) {
          var tabs = $filter('filter')($scope.tabs, $scope.search);

          tabs.forEach(function (tab) {
            tab.selected = false;
          });

          tabs[0].selected = true;
        } else {
          for (var i = 0, l = $scope.tabs.length; i < l; i++) {
            $scope.tabs[i].selected = $scope.tabs[i].active;
          }
        }
        */
        
//        var unselect = function (input) {
//          input.forEach(function (array) {
//            array.forEach(function (obj) {
//              obj.selected = false;
//            });
//          });
//        };

        if ($scope.search) {
          
//          var result = [];
      
//          $scope.windows.forEach(function (array) {
//            var filteredTabs = array.filter(function (obj) {
//              return obj.title.toLowerCase().indexOf($scope.search) !== -1;
//            });
//            
//            if (!!filteredTabs.length) {
//              result.push(filteredTabs);
//            }
//          });
          
          
          var result = searchTabsFilter($scope.windows, $scope.search);
          
          // unselect all tabs
//          result.forEach(function (array) {
//            array.forEach(function (obj) {
//              obj.selected = false;
//            });
//          });
          
          $scope.unselect(result);

          // select the first tab in the search results
          result[0][0].selected = true;
        } else {
          
          // unselect all tabs
//          $scope.windows.forEach(function (array) {
//            array.forEach(function (obj) {
//              obj.selected = false;
//            });
//          });
          
          $scope.unselect($scope.windows);
        
          // select the active tab
          $scope.windows[0].forEach(function (obj) {
            if (obj.active) {
              obj.selected = true;
            }
          });
        }
      };
      
      $scope.mouse = true;

      $scope.mousemove = function (event) {

        $scope.mouse = event.clientX !== $scope.x || event.clientY !== $scope.y;

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
        /*
        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
          $scope.tabs[i].selected = false;
        }
        */
      };
      
      $scope.sortableConfig = {
        group: 'tabs',
        animation: 150,
        ghostClass: 'sortable-placeholder',
        disabled: false,
        onUpdate: function (event) {
          console.log("onUpdate");
          console.log(event);
          
          var id = event.model.id;
          
          chrome.tabs.move(id, {index: event.newIndex});
        },
        onAdd: function (event) {
          console.log("onAdd");
          console.log(event);
          
          var windowId;
          var windowIndex;
          
          
          
          if  (event.newIndex > 0) {
            windowId = event.models[0].windowId;
          } else {
            windowId = event.models[1].windowId;
          }
          
          var id = event.model.id;
          
          $scope.windows.forEach(function (window, i) {
            window.forEach(function (tab) {
              if (tab.id === id) {
               tab.windowId = windowId; 
              }
            });
          });
          
          
          
          chrome.tabs.move(id, {windowId: windowId, index: event.newIndex});
          
          $scope.checkEmpty();
          /*
          console.log('# of tabs: ' + $scope.tabs.length);
          
          var tabId = $scope.tabs[event.newIndex].id;
          var windowId;
          var index;
          
          if ($scope.tabs.length > event.newIndex + 1) {
            windowId = $scope.tabs[event.newIndex + 1].windowId;
          } else {
            windowId = $scope.tabs[event.newIndex - 1].windowId;
          }
          
          console.log(event.newIndex);
          console.log('windowId: ' + windowId);
          var sumOfTabs = 0;
          
          $scope.tabsInEachWindow.forEach(function (window, i) {
            if ($scope.tabs[event.newIndex].windowId === window.windowId) {
              console.log(i);
              
              for (var j = i; j > 0; j--) {
                sumOfTabs += $scope.tabsInEachWindow[j - 1].tabs;
              }
            }
          });
          
          console.log('sum of tabs ' + sumOfTabs);
          index = event.newIndex - sumOfTabs;
          
          chrome.tabs.move(tabId, {windowId: windowId, index: index});
          */
        }
      };

      $scope.keydown = function (event) {
        var windows, index, windowIndex, id, windowId;
        
        /*
        if ($scope.search) {
          tabs = $filter('filter')($scope.tabs, $scope.search);
        } else {
          tabs = $scope.tabs;
        }
        */
        
        if ($scope.search) {
//          var result = [];
//      
//          $scope.windows.forEach(function (array) {
//            var filteredTabs = array.filter(function (obj) {
//              return obj.title.toLowerCase().indexOf($scope.search) !== -1;
//            });
//            
//            if (!!filteredTabs.length) {
//              result.push(filteredTabs);
//            }
//          });
          
          windows = searchTabsFilter($scope.windows, $scope.search);
        } else {
          windows = $scope.windows;
        }
        
       
        
        windows.forEach(function (window, i) {
          window.forEach(function (tab, j) {
            if (tab.selected) {
              id = tab.id;
              windowId = tab.windowId;
              index = j;
              windowIndex = i;
            }
          });
        });
        
        /*
        for (var i = 0, l = tabs.length; i < l; i++) {
          if (tabs[i].selected) {
            tabs[i].selected = false;
            index = i;
            id = tabs[i].id;
            windowId = tabs[i].windowId;
            break;
          }
        }
        */

        switch (event.which) {
          case 8: // delete
            if (!$scope.search) {
              $scope.close(windowId, id);
            }
            break;

          case 13: // enter
            $scope.goToTab(windowId, id);
            break;
            
          case 27: // esc
            window.close();
            break;

          case 38: // up arrow
            /*
            if (index > 0) {
              tabs[index - 1].selected = true;
            } else {
              tabs[tabs.length - 1].selected = true;
            }
            */
            
//            windows.forEach(function (window) {
//              window.forEach(function (tab) {
//                  tab.selected = false;
//              });
//            });
            $scope.unselect(windows);
            
            
            // if it's not the first tab in the window
            if (index > 0) { 
              windows[windowIndex][index - 1].selected = true;
            } else {
              // if it's not in the first window
              if (windowIndex > 0) {
                // select the last tab of the window below
                windows[windowIndex - 1][windows[windowIndex - 1].length - 1].selected = true;
              } else {
                // select the last tab on the last window
                windows[windows.length - 1][windows[windows.length - 1].length - 1].selected = true;
              }
            }

            $scope.mouse = false;
            break;

          case 40: // down arrow
            /*
            if (index < tabs.length - 1) {
              tabs[index + 1].selected = true;
            } else {
              tabs[0].selected = true;
            }
            */
            
            $scope.unselect(windows);
            
            // if it's not the last tab in the window
            if (index < windows[windowIndex].length - 1) {
              windows[windowIndex][index + 1].selected = true;
            } else {
              // if it's not in the last window
              if (windowIndex < windows.length - 1) {
                // select the first tab of the window below
                windows[windowIndex + 1][0].selected = true;
              } else {
                // select the first tab on the first window
                windows[0][0].selected = true;
              }
            }

            $scope.mouse = false;
            break;

          default:
            break;
        }
      };
      
      $scope.keyup = function (event) {
        if ($scope.search) {
          $scope.sortableConfig.disabled = true;
        } else {
          $scope.sortableConfig.disabled = false;
        }
      };
      
      $scope.checkEmpty = function () {
        console.log("checking");
        
        $scope.windows.forEach(function (window, i) {
          if (window.length === 0) {
            $scope.windows.splice(i, 1);
          }
        });
      };
    }
  ]);

  app.directive('tabs', function ($q, getTabs, getCurrentWindow, getAllWindows, searchTabsFilter) {
    function link(scope, element, attrs) {
      /*
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
      */
      
      $q.all([getTabs, getCurrentWindow, getAllWindows]).then(function (data) {
        var allTabs = data[0];
        var currentWindowId = data[1].id;
        
        
        var windows = [];
        
        for (var i = 0, j = data[2].length; i < j; i++) {
          var tabs = [];
          
          for (var k = 0, l = allTabs.length; k < l; k++) {
            if (allTabs[k].windowId === data[2][i].id) {
              tabs.push(allTabs[k]);
            }
          }
          
          if (data[2][i].id === currentWindowId) {
            windows.unshift(tabs);
          } else {
            windows.push(tabs);
          }
        }
        
        var activeIndex;
        
        windows[0].forEach(function (tab, i) {
          if (tab.active) {
            activeIndex = i;
          }
        });
        
        var position = (activeIndex - 12) * 36 + 18;
        element.animate({scrollTop: position}, 1);
        /*
//        var tabs = data[0];
//        var currentWindowId = data[1].id;
//        var active;

//        tabs.forEach(function (tab) {
//          if (tab.windowId !== currentWindowId) {
//            tab.selected = false;
//            tab.active = false;
//          }
//        });
        
//        for (var i = 0, l = tabs.length; i < l; i++) {
//          if (tabs[i].active) {
//            active = i;
//          }
//        }
*/
        
        
//        tabs.forEach(function (tab) {
//          if (tab.windowId !== $scope.currentWindowId) {
//            tab.selected = false;
//            tab.active = false;
//          }
//        });
        /*
        var windows = [];
        
        data[2].forEach(function (window) {
          var tabs = [];
          
          tabs.forEach(function (tab) {
            if (tab.windowId === window.id) {
              tabs.push(tab);
            }
          });
          
          if (window.id === currentWindowId) {
            windows.unshift(tabs);
          } else {
            windows.push(tabs);
          }
        });
        
        var activeIndex;
        
        windows[0].forEach(function (tab, i) {
          if (tab.active) {
            activeIndex = i;
          }
        });
        
        var position = (activeIndex - 12) * 36 + 18;
        element.animate({scrollTop: position}, 1);
        */
      });

      $(window).on('keydown', function () {
        var windows;
        if (scope.search) {
//          var result = [];
//      
//          $scope.windows.forEach(function (array) {
//            var filteredTabs = array.filter(function (obj) {
//              return obj.title.toLowerCase().indexOf($scope.search) !== -1;
//            });
//            
//            if (!!filteredTabs.length) {
//              result.push(filteredTabs);
//            }
//          });
          
          windows = searchTabsFilter(scope.windows, scope.search);
        } else {
          windows = scope.windows;
        }
        
        
        
        console.log($('.selected'));
        console.log(Number($('.selected').attr('id')));
        console.log($('.selected').offset().top);
        console.log(scope.windows);
        var tabId = Number($('.selected').attr('id'));
        
        
        var findIndex = function (windows, id) {
          var count = 0;
          
          for (var i = 0; i < windows.length; i++) {
            for (var j = 0; j < windows[i].length; j++) {
              if (windows[i][j].id == id) {
                return count;
              }
              
              count += 1;
            }
          }
          /*
          windows.forEach(function (array) {
            array.forEach(function (obj) {
              
              if (obj.id === id) {
                return count;
              }
              
              console.log(obj.id === id);
              if (obj.id == id) {
                return count;
              }
              
              count += 1;
            });
          });
          
          return count;
          */
          /*
          windows.forEach(function (array) {
            array.forEach(function (obj) {
              
              if (obj.id === id) {
                return count;
              } 
              count += 1;
            });
          });
          */
        };
        
        var index = findIndex(windows, tabId);
        
        var windowIndex;
        
        windows.forEach(function (array, i) {
          array.forEach(function (obj) {
            if (obj.id === tabId) {
              windowIndex = i;
            }  
          });
        });
        
//        console.log(count);
        
        
        var offset = $('.selected').offset().top;
        /*
        console.log(offset);
        var index = $('.selected').index();
        console.log(index);
        var position;
        */
        
        var dividers = 17;
         
        var position;
        if (offset < 52) {
          position = index * 36 + dividers * windowIndex;
          element.animate({scrollTop: position}, 100);
        } else if (offset > 464) {
          position = (index - 12) * 36 + 18 + dividers * windowIndex;
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
