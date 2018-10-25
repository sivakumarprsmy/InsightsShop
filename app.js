//importing modules
var express = require('express');
var db = require('./models/db');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

const route = require('./routes/route')

//port no
const port = process.env.PORT || 3000;

//adding middleware - cors
app.use(cors());

//body - parser
app.use(bodyparser.json());

//routes
app.use('/api',route);
app.use(express.static(__dirname + '/client'));

app.get('/',(req,res)=>{
	//res.send("InfyInsightsShop Under Construction...");
	res.sendFile(__dirname+"/client/index.html");
});

app.listen(port, ()=>{
	console.log("Server started at port: "+port);

});
