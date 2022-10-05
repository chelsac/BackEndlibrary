const express=require('express');
const cors=require('cors');
const bookData=require('./model/bookdata');
const userData=require('./model/userdata');
const path = require('path');
const port= process.env.PORT || 3000;

const app=new express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const jwt=require('jsonwebtoken');
app.use(express.static('./dist/front-end'));


 


app.post("/api/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Method:GET,POST,PUT,DELETE");
  userData
  .findOne({ email: req.body.email, password: req.body.password },(err,user)=>{
    if(err){
      console.log("error is",err)
    }
    else{
      console.log(user)
    }
  })
  .clone()
  .then((user) => {
    if(user !== null){
    let payload = { subject: user.email + user.password };
    let token = jwt.sign(payload, "secretKey");
    res.status(200).send({ token });
    }
    else{
      res.status(401).send('Wrong Credentials')
    }
  });

});

//dummy

// email="admin@gmail.com";
// password="12345678";

// app.post('/login',function(req,res){
//   if(email != req.body.email){
//     res.status(401).send('Invalid Username');
//   }
//   else if(password != req.body.password){
//     res.status(401).send('Invalid password');
//   }
//   else{
//     let payload={subject:email+password};
//     let token=jwt.sign(payload,'secretkey')
//     res.status(200).send({token});
//   }

//   })

  function verifyToken(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized request');
    }
    let token=req.headers.authorization.split(' ')[1];
    if(token==null){
      return res.status(401).send('Unauthorized request');
    }
    let payload=jwt.verify(token,'secretkey');
    console.log(payload);
    if(!payload){
      return res.status(401).send('Unauthorized request');
    }
    req.userId=payload.subject;
    next();
  }

//dummy end

app.post('/api/addbook',function(req,res){
var item={
    title:req.body.title,
    author:req.body.author,
    description:req.body.description,
    image:req.body.image
}
var data=bookData(item);
data.save();
bookData.find().then(function(data){
    res.send(data);
})
})

app.post('/api/adduser',function(req,res){
  var item={
      username:req.body.username,
      email:req.body.email,
      password:req.body.password
  }
  var data=userData(item);
  data.save();
  userData.find().then(function(data){
      res.send(data);
  })
  })


app.get('/api/books', function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE");

    bookData.find()
    .then(function(books){
      res.send(books);
    })
  })
  app.delete('/api/delete/:id',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE");
    console.log(req.params.id);
    bookData.findByIdAndDelete(req.params.id).then(()=>{
      console.log('success')
      res.send();
  })
     
    })

    app.put('/api/edit',function(req,res){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE");
    
        id=req.body.book._id;
        title=req.body.book.title;
        author=req.body.book.author;
        image=req.body.book.image;
        description=req.body.book.description;
        bookData.findByIdAndUpdate({"_id":id},
                                    {$set:{"title":title,
                                            "author":author,
                                            "image":image,
                                            "description":description
                                           }})
          .then(function(){
            res.send();
          })
    
    });

    app.get('/api/:id', function(req,res){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE");
  
  
      const id=req.params.id;
      bookData.findOne({"_id":id}).then((_book)=>{
        res.send(_book);
      })
    
    })

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname + '/dist/front-end/index.html'));
     }
     );

app.listen(port,function(){
    console.log("server is running at "+3000);
});


