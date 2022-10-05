const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://test:test@cluster0.ejygs4h.mongodb.net/libraryDB?retryWrites=true&w=majority');
const UserScheme=mongoose.Schema({
    username:String,
    email:String,
    password:String
});

var userData=mongoose.model('user',UserScheme);
module.exports=userData;