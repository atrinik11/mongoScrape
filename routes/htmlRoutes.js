var db = require("../models");

module.exports = function(app) {
    //Load the index page
    app.get("/", function(req, res) {
        db.Article.find({}).then(function(results) {
            res.render("index", {
                Article: results
            });
        });
    });

    //Load the saved page
    app.get("/saved", function(req, res) {
        db.Save.find({}).then(function(results) {
            res.render("saved", {
                Save: results
            });
        });
    });
}