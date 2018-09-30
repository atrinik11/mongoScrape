var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Using the Schema constructor, creating a new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//Creating the model from the above schema using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

//Export the Article model
module.exports = Article;