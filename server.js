// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;

//Initialize express
var app = express();

//Configure the middleware

//Use morgan logger for logging request
app.use(logger("dev"));
//Use body-parser for handling form submission
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Use handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



//Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

//Start the server
// db.mongoose.connection.on
app.listen(PORT, function() {
    console.log("App running on port: " + PORT + "!");
});
