(function (window, angular, undefined) {
  'use strict';

  var app = angular.module('tabio', ['cfp.hotkeys', 'ng-sortable']);

  app.factory('getTabs', ['$q', function ($q) {
    var deferred = $q.defer();

    chrome.tabs.query({}, function (tabs) {
      deferred.resolve(tabs);
    });

    return deferred.promise;
  }]);

  app.factory('getTabGroups', ['$q', function ($q) {
    var deferred = $q.defer();

    chrome.windows.getAll({}, function (tabGroups) {
      deferred.resolve(tabGroups);
    });

    return deferred.promise;
  }]);

  app.factory('focus', function ($timeout, $window) {
    return function (name) {
      // Run on the next turn of the event loop
      $timeout(function () {
        var element = $window.document.querySelector(name);
        if (element) {
          element.focus();
        }
      });
    };
  });

  app.filter('filterTabs', function () {
    return function (tabGroups, search) {
      if (!search) {
        tabGroups.forEach(function (tabGroup, i) {
          if (!tabGroup.length) {
            tabGroups.splice(i, 1);
          }
        });

        return tabGroups;
      }

      var filteredTabGroups = [];

      tabGroups.forEach(function (tabGroup) {
        var fuse = new Fuse(tabGroup, {
          threshold: 0.4,
          keys: ['title', 'url']
        });
        var filteredTabs = fuse.search(search);

        if (!!filteredTabs.length) {
          filteredTabGroups.push(filteredTabs);
        }
      });

      return filteredTabGroups;
    };
  });

  app.controller('MainController', ['$scope', '$q', '$timeout', 'getTabs', 'getTabGroups', 'filterTabsFilter', 'hotkeys', 'focus',
    function ($scope, $q, $timeout, getTabs, getTabGroups, filterTabsFilter, hotkeys, focus) {

      var unselect = function (tabGroups) {
        tabGroups.forEach(function (tabGroup) {
          tabGroup.forEach(function (tab) {
            tab.selected = false;
          });
        });
      };

      var selectTab = function (tab) {
        unselect($scope.filteredTabGroups);
        tab.selected = true;
      };

      $q.all({tabs: getTabs, tabGroups: getTabGroups})
        .then(function (result) {
          $scope.tabGroups = [];

          // Set $scope.currentTabGroupId
          result.tabGroups.forEach(function (tabGroup) {
            if (tabGroup.focused) {
              $scope.currentTabGroupId = tabGroup.id;
            }
          });

          // Only select active tab in the current tab group
          result.tabs.forEach(function (tab) {
            if (tab.windowId !== $scope.currentTabGroupId) {
              tab.active = false;
              tab.selected = false;
            }
          });

          // Generate $scope.tabGroups
          result.tabGroups.forEach(function (tabGroup) {
            var matchedTabs = [];

            result.tabs.forEach(function (tab) {
              if (tab.windowId === tabGroup.id) {
                matchedTabs.push(tab);
              }
            });

            if (tabGroup.id === $scope.currentTabGroupId) {
              $scope.tabGroups.unshift(matchedTabs);
            } else {
              $scope.tabGroups.push(matchedTabs);
            }
          });

          console.log($scope.tabGroups);

          $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);

          console.log($scope.filteredTabGroups);

          // Run on the next turn of the event loop
          $timeout(function () {
            $scope.$broadcast('selectionChanged');
          }, 0);
        });

      $scope.onChange = function () {
        $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);

        if ($scope.search) {
          // Select the first tab in the search results
          selectTab($scope.filteredTabGroups[0][0]);

          $scope.sortableConfig.disabled = true;
        } else {
          // Select the active tab
          $scope.filteredTabGroups[0].forEach(function (tab) {
            if (tab.active) {
              selectTab(tab);
            }
          });

          $scope.sortableConfig.disabled = false;
        }

        mouse = false;

        // Run on the next turn of the event loop
        $timeout(function () {
          $scope.$broadcast('selectionChanged');
        });
      };

      var mouse = false;
      var x, y;

      $scope.onMousemove = function (event) {
        mouse = event.clientX !== x || event.clientY !== y;

        x = event.clientX;
        y = event.clientY;
      };

      $scope.onMouseover = function (tab) {
        if (mouse) {
          selectTab(tab);
        }
      };

      $scope.goToTab = function (tabGroupId, tabId) {
        chrome.tabs.update(tabId, {active: true});

        if (tabGroupId !== $scope.currentTabGroupId) {
          chrome.windows.update(tabGroupId, {focused: true});
        }

        window.close();
      };

      $scope.closeTab = function (tabGroupId, tabId) {
        var tabGroupIndex, tabIndex, filteredTabGroupIndex, filteredTabIndex;

        chrome.tabs.remove(tabId);

        $scope.tabGroups.forEach(function (tabGroup, i) {
          tabGroup.forEach(function (tab, j) {
            if (tab.id === tabId) {
              tabGroupIndex = i;
              tabIndex = j;
            }
          });
        });

        $scope.filteredTabGroups.forEach(function (tabGroup, i) {
          tabGroup.forEach(function (tab, j) {
            if (tab.id === tabId) {
              filteredTabGroupIndex = i;
              filteredTabIndex = j;
            }
          });
        });

        $scope.tabGroups[tabGroupIndex].splice(tabIndex, 1);
        $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);

        // If the tab group isn't empty
        if (!!$scope.filteredTabGroups[filteredTabGroupIndex]) {

          // If the tab isn't the last tab
          if (filteredTabIndex < $scope.filteredTabGroups[filteredTabGroupIndex].length) {
            // Select the next tab
            selectTab($scope.filteredTabGroups[filteredTabGroupIndex][filteredTabIndex]);
          } else {
            // Select the previous tab
            selectTab($scope.filteredTabGroups[filteredTabGroupIndex][filteredTabIndex - 1]);
          }

        } else {

          // If the tab group isn't the last tab group
          if (filteredTabGroupIndex < $scope.filteredTabGroups.length) {
            // Select the first tab in the next tab group
            selectTab($scope.filteredTabGroups[filteredTabGroupIndex][0]);
          } else {
            // Select the last tab in the previous tab group
            selectTab($scope.filteredTabGroups[filteredTabGroupIndex - 1][$scope.filteredTabGroups[filteredTabGroupIndex - 1].length - 1]);
          }

        }

        mouse = false;
      };

      hotkeys.bindTo($scope)
        .add({
          combo: 'up',
          description: 'Select previous tab',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            var tabGroupIndex, tabIndex;

            $scope.filteredTabGroups.forEach(function (tabGroup, i) {
              tabGroup.forEach(function (tab, j) {
                if (tab.selected) {
                  tabGroupIndex = i;
                  tabIndex = j;
                }
              });
            });

            // If it's not the first tab in the tab group
            if (tabIndex > 0) {
              // Select the previous tab
              selectTab($scope.filteredTabGroups[tabGroupIndex][tabIndex - 1]);
            } else {
              // If it's not in the first tab group
              if (tabGroupIndex > 0) {
                // Select the last tab of the previous tab group
                selectTab($scope.filteredTabGroups[tabGroupIndex - 1][$scope.filteredTabGroups[tabGroupIndex - 1].length - 1]);
              } else {
                // Select the last tab on the last tab group
                selectTab($scope.filteredTabGroups[$scope.filteredTabGroups.length - 1][$scope.filteredTabGroups[$scope.filteredTabGroups.length - 1].length - 1]);
              }
            }

            mouse = false;

            // Run on the next turn of the event loop
            $timeout(function () {
              $scope.$broadcast('selectionChanged');
            });
          }
        })
        .add({
          combo: 'down',
          description: 'Select next tab',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            var tabGroupIndex, tabIndex;

            $scope.filteredTabGroups.forEach(function (tabGroup, i) {
              tabGroup.forEach(function (tab, j) {
                if (tab.selected) {
                  tabGroupIndex = i;
                  tabIndex = j;
                }
              });
            });

            // If the tab is not the last tab in the window
            if (tabIndex < $scope.filteredTabGroups[tabGroupIndex].length - 1) {
              // Select the next tab
              selectTab($scope.filteredTabGroups[tabGroupIndex][tabIndex + 1]);
            } else {
              // If the tab is not in the last window
              if (tabGroupIndex < $scope.filteredTabGroups.length - 1) {
                // Select the first tab of the next tab group
                selectTab($scope.filteredTabGroups[tabGroupIndex + 1][0]);
              } else {
                // Select the first tab on the first tab group
                selectTab($scope.filteredTabGroups[0][0]);
              }
            }

            mouse = false;

            // Run on the next turn of the event loop
            $timeout(function () {
              $scope.$broadcast('selectionChanged');
            });
          }
        })
        .add({
          combo: 'meta+up',
          description: 'Move selected tab up',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();

            if (!$scope.search) {
              var tabGroupIndex, tabGroupId, oldTabIndex, newTabIndex, tabId;

              $scope.tabGroups.forEach(function (tabGroup, i) {
                tabGroup.forEach(function (tab, j) {
                  if (tab.selected) {
                    tabGroupIndex = i;
                    oldTabIndex = j;
                    tabId = tab.id;
                  }
                });
              });

              // Remove selected tab from the current tab group
              var removed = $scope.tabGroups[tabGroupIndex].splice(oldTabIndex, 1)[0];

              // If it's not the first tab in the tab group
              if (oldTabIndex > 0) {
                newTabIndex = oldTabIndex - 1;

                // At "newIndex", remove 0 elements, insert the removed tab
                $scope.tabGroups[tabGroupIndex].splice(newTabIndex, 0, removed);

                chrome.tabs.move(tabId, {index: newTabIndex});
              } else {
                // If it's not in the first tab group
                if (tabGroupIndex > 0) {
                  newTabIndex =  $scope.tabGroups[tabGroupIndex - 1].length;

                  // Append the removed tab to the previous tab group
                  $scope.tabGroups[tabGroupIndex - 1].push(removed);

                  tabGroupId = $scope.tabGroups[tabGroupIndex - 1][0].windowId;
                } else {
                  newTabIndex =  $scope.tabGroups[$scope.tabGroups.length - 1].length;

                  // Append the removed tab to the last tab group
                  $scope.tabGroups[$scope.tabGroups.length - 1].push(removed);

                  tabGroupId = $scope.tabGroups[$scope.tabGroups.length - 1][0].windowId;
                }

                chrome.tabs.move(tabId, {windowId: tabGroupId, index: newTabIndex});

                $scope.tabGroups.forEach(function (tabGroup) {
                  tabGroup.forEach(function (tab) {
                    if (tab.id === tabId) {
                      tab.windowId = tabGroupId;
                    }
                  });
                });
              }

              $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);

              mouse = false;

              // Run on the next turn of the event loop
              $timeout(function () {
                $scope.$broadcast('selectionChanged');
              });
            }
          }
        })
        .add({
          combo: 'meta+down',
          description: 'Move selected tab down',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();

            if (!$scope.search) {
              var tabGroupIndex, tabGroupId, oldTabIndex, newTabIndex, tabId;

              $scope.tabGroups.forEach(function (tabGroup, i) {
                tabGroup.forEach(function (tab, j) {
                  if (tab.selected) {
                    tabGroupIndex = i;
                    oldTabIndex = j;
                    tabId = tab.id;
                  }
                });
              });

              // Remove selected tab from the current tab group
              var removed = $scope.tabGroups[tabGroupIndex].splice(oldTabIndex, 1)[0];

              // If the tab is not the last tab in the tab group
              if (oldTabIndex < $scope.tabGroups[tabGroupIndex].length) {
                newTabIndex = oldTabIndex + 1;

                // At "newIndex", remove 0 elements, insert the removed tab
                $scope.tabGroups[tabGroupIndex].splice(newTabIndex, 0, removed);

                chrome.tabs.move(tabId, {index: newTabIndex});
              } else {
                newTabIndex = 0;

                // If the tab is not in the last tab group
                if (tabGroupIndex < $scope.tabGroups.length - 1) {
                  // Prepend the removed tab to the next tab group
                  $scope.tabGroups[tabGroupIndex + 1].unshift(removed);

                  tabGroupId = $scope.tabGroups[tabGroupIndex + 1][$scope.tabGroups[tabGroupIndex + 1].length - 1].windowId;
                } else {
                  // Prepend the removed tab to the first tab group
                  $scope.tabGroups[0].unshift(removed);

                  tabGroupId = $scope.tabGroups[0][$scope.tabGroups[0].length - 1].windowId;
                }

                chrome.tabs.move(tabId, {windowId: tabGroupId, index: newTabIndex});

                $scope.tabGroups.forEach(function (tabGroup) {
                  tabGroup.forEach(function (tab) {
                    if (tab.id === tabId) {
                      tab.windowId = tabGroupId;
                    }
                  });
                });
              }

              $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);

              mouse = false;

              // Run on the next turn of the event loop
              $timeout(function () {
                $scope.$broadcast('selectionChanged');
              });
            }
          }
        })
        .add({
          combo: 'enter',
          description: 'Go to selected tab',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            var tabGroupId, tabId;

            $scope.filteredTabGroups.forEach(function (tabGroup) {
              tabGroup.forEach(function (tab) {
                if (tab.selected) {
                  tabGroupId = tab.windowId;
                  tabId = tab.id;
                }
              });
            });

            $scope.goToTab(tabGroupId, tabId);
          }
        })
        .add({
          combo: 'meta+backspace',
          description: 'Close selected tab',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            var tabGroupId, tabId;

            $scope.filteredTabGroups.forEach(function (tabGroup) {
              tabGroup.forEach(function (tab) {
                if (tab.selected) {
                  tabGroupId = tab.windowId;
                  tabId = tab.id;
                }
              });
            });

            $scope.closeTab(tabGroupId, tabId);
          }
        })
        .add({
          combo: 'esc',
          description: 'Close the extension',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            window.close();
          }
        })
        .add({
          combo: 'meta+shift+k',
          description: 'Focus search input',
          callback: function (event) {
            event.preventDefault();
            focus('.search');
          }
        });

      $scope.sortableConfig = {
        group: 'tabs',
        animation: 150,
        ghostClass: 'sortable-placeholder',
        disabled: false,

        // Tab is dropped into a tab group from another tab group
        onAdd: function (event) {
          var tabId = event.model.id;
          var tabGroupId, tabGroupIndex;

          if (event.newIndex > 0) {
            tabGroupId = event.models[0].windowId;
          } else {
            tabGroupId = event.models[1].windowId;
          }

          $scope.tabGroups.forEach(function (tabGroup) {
            tabGroup.forEach(function (tab) {
              if (tab.id === tabId) {
                tab.windowId = tabGroupId;
              }
            });
          });

          chrome.tabs.move(tabId, {windowId: tabGroupId, index: event.newIndex});

          $scope.filteredTabGroups = filterTabsFilter($scope.tabGroups, $scope.search);
        },

        // Changed sorting within tab group
        onUpdate: function (event) {
          var tabId = event.model.id;

          chrome.tabs.move(tabId, {index: event.newIndex});
        }
      };

    }
  ]);

  app.config(function (hotkeysProvider) {
    hotkeysProvider.includeCheatSheet = false;
  });

  app.directive('tabGroups', [function () {
    function link(scope, element, attrs) {
      var top = 54;
      var bottom = 468;

      var scrollToSelection = function () {
        var offset = $('.selected').offset().top;
        var oldScrollPosition = $('.tab-groups').scrollTop();
        var newScrollPosition;

        if (offset < top) {

          newScrollPosition = oldScrollPosition - (top - offset);
          element.scrollTop(newScrollPosition);

        } else if (offset > bottom) {

          newScrollPosition = oldScrollPosition + (offset - bottom);
          element.scrollTop(newScrollPosition);

        }
      };

      scope.$on('selectionChanged', scrollToSelection);
    }

    return {
      restrict: 'A',
      link: link
    };
  }]);

})(window, window.angular);
