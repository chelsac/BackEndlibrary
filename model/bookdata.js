const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://test:test@cluster0.ejygs4h.mongodb.net/libraryDB?retryWrites=true&w=majority');
const BookScheme=mongoose.Schema({
    title:String,
    author:String,
    description:String,
    image:String
});

var bookData=mongoose.model('book',BookScheme);
module.exports=bookData;