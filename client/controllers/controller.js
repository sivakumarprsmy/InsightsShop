var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);
myApp.controller('AppCtrl', ['$scope', '$http', '$location', '$cookies', function ($scope, $http, $location, $cookies) {

  $scope.isSignedIn = false;
  
  // book search 
  $scope.search = function (search_param) {
    $location.path('/book-list');

    if (angular.isUndefined(search_param)) {
      search_param = " ";
    }

    $http.get('/api/books/' + search_param).then(function (response) {
      if (response.data.length > 0) {
        $scope.books = response.data;
        $scope.book = "";
        console.log("inside search");
        $scope.noResults = false;
      }
      else{
        $scope.noResults = true;
        //console.log('no resilts');
      }
    });
  }

  // book details 
  $scope.goToBookDetails = function (book) {
    $scope.reviewSuccess = false;
    $location.path('/book-details');
    $http.get('/api/bookDetails/' + book._id).then(function (response) {
      $scope.bookDetails = response.data[0];
    });
    $http.get('/api/reviews/' + book.title).then(function (response) {
      $scope.reviews = response.data
    });
  }

  // sign in
  $scope.signIn = function (email, password) {
    $scope.showLoginError = false;
    $scope.registrationSuccess = false;
    $http.get('/api/customer/' + email).then(function (response) {

      if (response.data.length > 0 && response.data[0]) {
        if (response.data[0].password == password) {
          console.log("logged in");
          $cookies.put('isSignedIn', true);
          $scope.isSignedIn = true;
          $scope.customerFirstName = response.data[0].first_name;
          $scope.customerLastName = response.data[0].last_name;
          $scope.search("");
        }
        else {
          console.log("error");
          $scope.showLoginError = true;
        }
      }
      else{
        console.log("error");
        $scope.showLoginError = true;
      }
    });
  }

  // sign out
  $scope.signOut = function () {
    $cookies.put('isSignedIn', false);
    $scope.isSignedIn = false;
    //$location.path('/book-list');
    $scope.search("");
  }

  $scope.showRegistrationForm = true;
  // registration
  $scope.register = function (customer) {
    $http.post('/api/customer', customer).then(function (response) {
      if (response.data.msg != 'Failed to add customer') {
        $scope.registrationSuccess = true;
        $location.path('/sign-in');
      }
      else {
        console.log(response);
      }
    });
  }
  
  // search stores
  $scope.getStores = function (city) {
    if (angular.isUndefined(city)) {
      city = "";
    }
    $http.get('/api/stores/' + city).then(function (response) {
      if(response.data.length > 0){
        $scope.stores = response.data;
        $scope.noStoresFound = false;
      }
      else{
        $scope.noStoresFound = true;
      }
      
    });

  }

  $scope.go = function (path) {
    $location.path(path);
  };

  $scope.setAction = function (action) {
    $scope.action = action;
  }

  $scope.submitReview = function (review) {
    review.title = $scope.bookDetails.title;
    review.reviewer_name = $scope.customerFirstName + " " + $scope.customerLastName;
    console.log(review);
    $http.post('/api/review', review).then(function (response) {
      if (response.data.msg != 'Failed to add review') {
        $scope.reviewSuccess = true;
        $http.get('/api/reviews/' + review.title).then(function (response) {
          $scope.reviews = response.data;
        });
      }
      else {
        console.log(response);
      }
    });
  }

}]);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/templates/welcome.html"
    })
    .when("/index", {
      templateUrl: "index.html"
    })
    .when("/book-list", {
      templateUrl: "/templates/book-list.html"
    })
    .when("/book-details", {
      templateUrl: "/templates/book-details.html"
    })
    .when("/locate-stores", {
      templateUrl: "/templates/locate-stores.html"
    })
    .when("/sign-in", {
      templateUrl: "/templates/sign-in.html"
    })
    .when("/register", {
      templateUrl: "/templates/register.html"
    });
});