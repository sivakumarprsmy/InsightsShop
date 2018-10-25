var mongoose = require('mongoose');

//var dbURI = 'mongodb://localhost:27017/InfyInsightsShop';
var dbURI = 'mongodb://infy-insights-shop:262jNqbB9WA9xGwXIxIZUiN80aEjnRDwe4Ddo4rHWgnBkoIguLzzgFKb5sB2ueF5s72noiYwt3RTAnUcYGrIAg%3D%3D@infy-insights-shop.documents.azure.com:10255/?ssl=true';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});