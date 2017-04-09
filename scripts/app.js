(function() {
  'use strict';


angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItems);

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {

var service = this;

service.getMatchedMenuItems = function(searchTerm){
  return $http({
    method: 'GET',
    url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
  }).then(function (result) {
    var items = result.data.menu_items;

    var foundItems = [];

    for(var i=0;i < items.length;i++) {
      if(items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >=0 ) {
        foundItems.push(items[i]);
      }
    }

    return foundItems;
  });
}
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var vm = this;

  vm.searchTerm = "";

  vm.narrowIt = function () {
    if(vm.searchTerm === "") {
      vm.items=[];
      return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(vm.searchTerm);
    promise.then(function (response) {
      vm.items = response;
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  vm.removeItem = function (index) {
    vm.items.splice(index, 1);
  }
}

function foundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  }
  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;

  console.log(list);

  list.isEmpty= function () {
    return list.found != undefined && list.found.length === 0;
  }
}
}());
