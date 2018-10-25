var myApp = angular.module('myApp', ['ngRoute','ngCookies']);
myApp.controller('AppCtrl', ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location,$cookies) {    
  $scope.isSignedIn = false;
  var updateView = function(){
    $http.get('/api/books').then(function(response) {
      $scope.books = response.data; 
      $scope.book = "";
      $scope.hideWelcomeBanner = false;
    });
  };

  updateView();

  $scope.search = function(search_param){
    $location.path('/book-list');

    if(angular.isUndefined(search_param)){
      search_param = "";
    }

    $http.get('/api/books/' + search_param).then(function(response) {
        $scope.books = response.data; 
        $scope.book = "";
        console.log("inside search");
        $scope.hideWelcomeBanner = true;
     });
  }

  $scope.goToBookDetails = function(book){
    $location.path('/book-details');
    $http.get('/api/bookDetails/' + book._id).then(function(response) {
      $scope.bookDetails = response.data[0];
   });
   $http.get('/api/reviews/' + book.title).then(function(response) {
    $scope.reviews = response.data;
   });
  }

  $scope.signIn = function(email, password){
    $scope.showLoginError = false;
    $http.get('/api/customer/'+email).then(function(response){

      if(response.data[0]){
        if (response.data[0].password == password){
          console.log("logged in");
          $cookies.put('isSignedIn', true);
          $scope.isSignedIn = true;
          $location.path('/book-list');
          $scope.customerFirstName = response.data[0].first_name; 
        }
        else{
          console.log("error");
          $scope.showLoginError = true;
        }
      }
    });
  }

  $scope.signOut = function(){
    $cookies.put('isSignedIn',false);
    $scope.isSignedIn = false;
    $location.path('/book-list');
  }

  $scope.showRegistrationForm = true;
  $scope.register = function(customer){
    $http.post('/api/customer',customer).then(function(response){
      if(response.data.msg != 'Failed to add customer'){
        $scope.showRegistrationForm = false;
      }
      else{
        console.log(response);
        $scope.showRegistrationForm = true;
      }
    });
  }
/*
  $scope.getStores = function(){
    $http.get('/api/stores/').then(function(response) {
      $scope.stores = response.data; 
    });    

  }
*/
  $scope.getStores = function(city){
    if(angular.isUndefined(city)){
      city = "";
    }
    $http.get('/api/stores/'+city).then(function(response) {
      $scope.stores = response.data; 
    });    

  }

  $scope.go = function ( path ) {
    $location.path(path);
  };

  $scope.setAction = function(action){
    $scope.action = action;
  }

}]);

myApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/welcome.html"
  })
  .when("/index", {
      templateUrl : "index.html"
  })
  .when("/book-list", {
    templateUrl : "/templates/book-list.html"
  })
  .when("/book-details", {
      templateUrl : "/templates/book-details.html"
  })
  .when("/locate-stores", {
    templateUrl : "/templates/locate-stores.html"
  })
  .when("/sign-in", {
    templateUrl : "/templates/sign-in.html"
  })
  .when("/register", {
    templateUrl : "/templates/register.html"
  });  
});