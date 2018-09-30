$(document).ready(function() {
    // var db = require("../models");


    //Adding Event Listeners 
    $(document).on("click", ".saveNote", noteSave);
    $(document).on("click", ".scrapeArticle",displayScrape);
    $(document).on('click', ".saveArticle", articleSave);
    $(document).on('click', ".submit", submitNote);
    // $(document).on("click", ".deleteArticle", articleDelete);
    //Grab the articles as json
    function displayScrape() {
        $.getJSON("/scrape", function(articles) {
            console.log(articles);
            var articleSet = [];
            for (var i = 0; i < articles.length; i++) {
                var title = articles[i].title;
                var link = articles[i].link;
                var summary = articles[i].para;
                console.log(title);
                console.log(link);
                console.log(summary);
                articleSet.push(
                    `<div class = 'card center'>
                        <div class = 'card-header'><a href = '${link}' target = '_blank'>${title}</a><a class = 'btn btn-success saveNote'>Save Article</a></div>
                        <div class = 'card-body'><h3 class = 'card-title'>${summary}</h3></div>
                    </div>`
                )          
            };
            var articleContainer = $(".article-post");
           articleContainer.append(articleSet);
           console.log("article display: ", articleContainer);
           articleContainer.data("id", articles._id);
           console.log("article: ", articleContainer);
           return articleContainer;
        });
    }

    $.get("/api/articles", function(data) {
        var savedArticle = [];
        for (var i = 0; i < data.length; i++) {
            var title = data[i].title;
            var link = data[i].link;
            var summary = data[i].para;
            console.log(title);
            console.log(link);
            console.log(summary);
            savedArticle.push(
                `<div class = 'card center'>
                    <div class = 'card-header'><a href = '${link}'>${title}</a><a class = 'btn btn-success saveNote'>Note</a></div>
                </div>`
            )     
        };
        $(".article-saved").append(savedArticle);
    });


    function noteSave() {
        $(".post-notes").empty();
        var thisId = $(this).data('data-id');
        var noteSave = {};
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function(data) {
            $(".modal-header").append(`<input id = 'title-input' name = 'title>`);
            $(".modal-body").append(`<textarea id = 'body-input' name = 'body'></textarea>`);
            if (data.note) {
                $('#title-input').val(data.note.title);
                $('#body-input').val(data.note.body);
            }
        });
    }

    function submitNote () {
        var thisId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/articles/:' + thisId,
            data:{
                title: $("#title-input").val(),
                body: $("#body-input").val()
            }
        })
        .then(function(data) {
            $(".post-notes").empty();
        })
    }

    function articleSave() {
        var dataSave = $(this).parent('.card');
        var title = dataSave.title;
        console.log(title);
        var entry = new db.Article(dataSave);
        // Now, save that entry to the db
        entry.update(
            {link: dataSave.link},
            dataSave,
            { upsert: true },
            function (error, doc){
                if (error) {
                    console.log(error);
                }
        })    
    }

})



