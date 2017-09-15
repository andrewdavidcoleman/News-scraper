// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require Article model
var Article = require("./models/article.js");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Making a request for BBC's "webdev" board. The page's HTML is passed as the callback's third argument
request("http://www.outdoorgearlab.com/articles", function(error, response, html) {
  if (error) {
    console.log(error);
  };

  // First, tell the console what server.js is doing
  console.log("\n***********************************\n" +
              "Grabbing every article name, topic, and\n" +
              "description from Outdoor Gear Labs's article board:" +
              "\n***********************************\n");

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each div-tag with the "nw-c-top..." class
  // (i: iterator. element: the current element)
  $("div.tag_tile_card").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).find(".tag_tile_title").text();
    var description = $(element).find(".tag_tile_description").text();
    var topic = $(element).find(".tag_tile_type").text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: "      " + title,
      topic: "      " + topic,
      description: description
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
