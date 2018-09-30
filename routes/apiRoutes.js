//Dependencies
var cheerio = require("cheerio");
var request = require("request");
var db = require("../models");

// //models
// var Article = require("../models/Article.js");
// var Note = require("../models/Note.js");
// var Save = require("../models/Save.js");

module.exports = function(app) {
    //A GET route for scraping the echoJS website
    app.get("/scrape", function(req, res) {
        //First the body of the html is grabbed with request
        request("https://www.nytimes.com/", function(error, response, html){
            var $ = cheerio.load(html);
            var articles = [];
            $('article').each(function(i, element) {
                var result = {};
                var url = "https://www.nytimes.com";
                result.title = $(element).find('h2').text().trim();
                result.link = url + $(element).find('a').attr("href");
                result.para = $(element).find("p").text().trim();
                if (result.title && result.link && result.para !== "") {
                    console.log(result);
                    articles.push(result);
                }
            });
            res.json(articles);
        });
    });

    //Route for getting all Articles from the db
    app.get("/api/articles", function(req, res) {
        //Grab every document in the Articles collection
        db.Article.find({})
        .then(function(dbArticle) {
            //If the article was found, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(error) {
            //If an error occurred. send it to the client
            res.json(error);
        });
    });

    //Route for garabbing a specific Article by id, populate it with it's Note
    app.get("/api/article/:id", function(req, res) {
        db.Article.findOne({_id: req.params.id})
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(error) {
            res.json(error);
        });
    });

    //Route for saving/updating an Article's associated Note
    app.post("/api/articles/:id", function(req, res) {
        //Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
        .then(function(dbNote) {
            //If a Note was created successfully, find one Article with an '_id' equal to 'req.params.id'. Update the Article to be associated with the new Note
            return db.Article.findOneAndUpdate(
                {_id: req.params.id}, 
                {body: req.body.body}, 
                {new: true}
            );
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(error) {
            res.json(error);
        });
    });

    //Route for saving an Article
    app.post("/api/article", function(req, res) {
        db.Article.create({
            saveArticleId: req.body._id,
            saveArticleTitle: req.body.title,
            saveArticleLink: req.body.link,
            saveArticleSummary: req.body.summary,
        })
        .then(function(results) {
            res.json(results);
        });
    });

    //Route for deleting saved Article
    app.delete("/api/delete", function(req, res) {
        var result = {};
        result._id = req.body._id;
        Save.findOneAndDelete({
            "_id": req.body._id
        }, function (error, data) {
            if(error) {
                console.log("error: ", error);
                res.json(error);
            }
            else {
                res.json(data);
            }
        });
    });

    //Route for note
    app.get("/api/notes/:id", function(req, res) {
        if(req.params.id) {
            Note.find({
                "article_id": req.params.id
            })
            .exec(function(error, data) {
                if (error) {
                    res.json(error)
                }
                else {
                    res.json(data);
                }
            });
        }
    });
}