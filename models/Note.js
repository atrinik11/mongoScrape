var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Using the Schema constructor, a new NoteSchema object is created
var NoteSchema = new Schema({
    // article_id: Schema.Types.ObjectId,
    title: String,
    body: String
});

//Creating the model from the above schema, using the mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

//Export the Note model
module.exports = Note;