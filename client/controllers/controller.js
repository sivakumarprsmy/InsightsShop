var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'geolocation']);
myApp.controller('AppCtrl', ['$scope', '$http', '$location', '$cookies', 'geolocation', 'storeLocatorFactory', '$rootScope', function ($scope, $http, $location, $cookies, geolocation, storeLocatorFactory, $rootScope) {

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
      else {
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
      else {
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

  // registration
  $scope.showRegistrationForm = true;
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

  // search stores by city
  $scope.getStoresByCity = function (city) {
    if (angular.isUndefined(city)) {
      city = "";
    }
    $http.get('/api/stores/' + city).then(function (response) {
      if (response.data.length > 0) {
        $scope.stores = response.data;
        $scope.noStoresFound = false;
      }
      else {
        $scope.noStoresFound = true;
      }

    });

  }

  // search stores without param
  $scope.getStores = function () {
    $location.path('/locate-stores');
    $http.get('/api/stores/').then(function (response) {
      if (response.data.length > 0) {
        $scope.stores = response.data;
        $scope.noStoresFound = false;
      }
      else {
        $scope.noStoresFound = true;
      }

    });

  }
  
  /*
  $scope.go = function (path) {
    $location.path(path);
  };*/

  // buy or rent action
  $scope.setAction = function (action) {
    $scope.action = action;
  }

  // submit review
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

  // show stores on map
  $scope.showStoresOnMap = function () {

    //$location.path('/locate-stores-on-map');

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function (data) {

      // Set the latitude and longitude equal to the HTML5 coordinates
      coords = { lat: data.coords.latitude, long: data.coords.longitude };

      // Display coordinates in location textboxes rounded to three decimal points
      $scope.formData = {};
      $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
      $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

      storeLocatorFactory.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

  }
}]);

// route provider
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
    })
    .when("/locate-stores-on-map", {
      templateUrl: "/templates/locate-stores-on-map.html"
    });
});

// factory to show stores on map
myApp.factory('storeLocatorFactory', function ($rootScope, $http) {


  // Initialize Variables
  var googleMapService = {};
  googleMapService.clickLat = 0;
  googleMapService.clickLong = 0;

  // Array of locations obtained from API calls
  var locations = [];

  // Variables we'll use to help us pan to the right spot
  var lastMarker;
  var currentSelectedMarker;

  // User Selected Location (initialize to center of America)
  var selectedLat = 39.50;
  var selectedLong = -98.35;

  // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
  googleMapService.refresh = function (latitude, longitude, filteredResults) {

    // Clears the holding array of locations
    locations = [];

    // Set the selected lat and long equal to the ones provided on the refresh() call
    selectedLat = latitude;
    selectedLong = longitude;

    // If filtered results are provided in the refresh() call...

    if (filteredResults) {

      // Then convert the filtered results into map points.
      locations = convertToMapPoints(filteredResults);

      // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
      initialize(latitude, longitude, true);
    }

    // If no filter is provided in the refresh() call...
    else {

      // Perform an AJAX call to get all of the records in the db.
      $http.get('/api/stores/').then(function (response) {

        // Then convert the results into map points
        locations = convertToMapPoints(response.data);

        // Then initialize the map -- noting that no filter was used.
        initialize(latitude, longitude, false);
      });
    }
  };

  // Convert a JSON of users into map points
  var convertToMapPoints = function (response) {

    // Clear the locations holder
    var locations = [];

    // Loop through all of the JSON entries provided in the response
    for (var i = 0; i < response.length; i++) {
      var user = response[i];

      // Create popup windows for each record
      var contentString = '<p><b>Address Line 1</b>: ' + user.addr_line_1 + '<br><b>Address Line 2</b>: ' + user.addr_line_2 + '<br>' +
        '<b>City</b>: ' + user.city + '<br><b>State</b>: ' + user.state + '<br><b>Zip</b>: ' + user.zip + '<br><b>Country</b>: ' + user.country + '<br><b>Phone</b>: ' + user.phone + '</p>';

      // Converts each of the JSON records into Google Maps Location format (Note Lat, Lng format).
      locations.push(new Location(
        new google.maps.LatLng(user.location[1], user.location[0]),
        new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 320
        }),
        user.addr_line_1,
        user.addr_line_2,
        user.city,
        user.state,
        user.zip,
        user.country,
        user.phone
      ))
    }
    // location is now an array populated with records in Google Maps format
    return locations;
  };

  // Constructor for generic location
  var Location = function (latlon, addr_line_1, addr_line_2, city, state, zip, country, phone) {
    this.latlon = latlon;
    this.addr_line_1 = addr_line_1;
    this.addr_line_2 = addr_line_2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
    this.phone = phone;
  };

  // Initializes the map
  var initialize = function (latitude, longitude, filter) {
    $(document).ready(function ($) {
      // Uses the selected lat, long as starting point
      var myLatLng = { lat: parseFloat(selectedLat), lng: parseFloat(selectedLong) };
      // If map has not been created...
      if (!map) {

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: myLatLng
        });

      }
      // If a filter was used set the icons yellow, otherwise blue
      if (filter) {
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      }
      else {
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }

      // Loop through each location in the array and place a marker
      locations.forEach(function (n, i) {
        var marker = new google.maps.Marker({
          position: n.latlon,
          map: map,
          title: "Big Map",
          icon: icon,
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function (e) {

          // When clicked, open the selected marker's message
          currentSelectedMarker = n;
          n.message.open(map, marker);
        });
      });

      // Set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // Clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function (e) {
        var marker = new google.maps.Marker({
          position: e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if (lastMarker) {
          lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    });
  };

  // Refresh the page upon window load. Use the initial latitude and longitude
  google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

  return googleMapService;
});