//jshint esversion:6
//Score server server
const express=require("express");
const request = require("request");
const bodyParser = require('body-parser');
const path= require("path");
const ejs = require('ejs');
const mongoose = require("mongoose");

// const cricapi = require("cricapi");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// to access data other than html use this folder
app.use('/public', express.static(__dirname + '/public'));

//Match data server stack

let matches=[
  {id:"1",series:"IPL",teams:"CSK VS MI",venue:"Chennai",score:"150/7",players:"player1:20*   player2:30"},
  {id:"2",series:"IPL",teams:"RCB VS RR",venue:"Bengaluru",score:"123/5",players:"player1:25*   player2:31"}
  ];
let commentry=[
  {match_id:1,commentry:[["name-1","jefbwe"],["name-2","owfouwf"]]},
  {match_id:2,commentry:[["name-1","jefbwe"],["name-2","owfouwf"]]}
];

//connect to the database Server
mongoose.connect("mongodb+srv://warfreak:backspace90-=@cluster0-vsfo0.mongodb.net/cricket_server", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
// mongoose.connect("mongodb://localhost:27017/cricket_server", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
//schema for the user set
const usersSchema = {
  name: String,
  designation: String,
  password: String,
  email:String,
  mobile_number:Number
};


const User = mongoose.model("users", usersSchema);



// routes for the HTML pages on the server from the client.
// routes listen
// root route
// login route
// signup route
// tour route

//this the home route for the application...
app.get("/",function(req,res){
 res.sendFile(path.join(__dirname,'/index.html'));
});

//this is the main route from the landing page to the landingPage
app.get("/login",function(req,res){
  res.sendFile(path.join(__dirname,'/login.html'));
});

//this is the sign-up route from the login page
app.get("/signup",function(req,res){
  res.sendFile(path.join(__dirname,'/signup.html'));
});

//this is the sign-up route from the admin page
app.get("/adduser-admin:ID",function(req,res){
  res.render('signup-admin',{ID:req.params.ID});
  // res.sendFile(path.join(__dirname,'/signup-admin.html'));
});

//this the route to the tour.html page from the login/signup page
app.get("/tour",function(req,res){
 res.sendFile(path.join(__dirname,'/tour.html'));
});

//this route is for the admin panel from the login route
app.get("/adminDash:ID",function(req,res){
  res.render('adminDash',{match_data:matches,ID:req.params.ID});
});

//error login route from the error_login
app.get("/error_login",function(req,res){
 res.sendFile(path.join(__dirname,'/error_login.html'));
});

//route to the remove user page
app.get("/remove:ID",function(req,res){
  res.render('remove user',{ID:req.params.ID});
});

//route to the creatematch user page
app.get("/createMatch:ID",function(req,res){
  res.render('create match',{ID:req.params.ID});
});

//route to the updateScore user page
app.get("/updateScore:ID",function(req,res){
  res.render('updateScore',{ID:req.params.ID});
});

//route to the add comment user page
app.get("/AComment:ID",function(req,res){
  res.render('AComment',{ID:req.params.ID});
});

//route to the add comment user page
app.get("/deleteMatch:ID",function(req,res){
  res.render('removeMatch',{ID:req.params.ID});
});

//this route is used to dynamically sense ans send respective commentry data page.
app.get("/match_info:matchID",function(req,res){
  console.log("executiong");
  //filtering the necessary data from COMMENTRY
  const result = commentry.filter(obj => {
    return obj.match_id == req.params.matchID;
  });
  // console.log(result);
  let Com=result[0].commentry;
  console.log(Com);
  const MData = matches.filter(obj=>{
    return obj.id== req.params.matchID;
  });
 res.render('match-info',{com:Com,matchData:MData[0]});
 // res.send(result);
});

// post routes for the server from the client
//routes list:
// Login
//signup

//this is used to make an admin login to post the data to the data list...
app.post("/login",function(req,res){
  //dont store the data on variables ..pass them direclty to the database

  const Email=req.body.Email;
  const Password= req.body.Password;
  // console.log(email);
  // console.log(password);

  User.findOne({email: Email, password:Password}, function (err, docs) {
    if (err) {
      console.log(docs);
      res.redirect("/error_login");
    } else {
      // console.log(docs);
      //docs is the data from the database of the entered name and password
      if(docs === null){
        // res.send("invalid user");
        res.redirect("/error_login");
      }else{
        if(docs.designation==="admin"){
          // res.send("admmin route");
          res.redirect("/adminDash"+docs.id);
        }
        else{
          res.render('tour',{match_data:matches});
        }
         // res.sendFile(path.join(__dirname,'/add files.html'));
      }
      }
  });
});
//end of the login procedures and routes related...

//post route to  handle the add user querry from the common route
app.post("/add_user", function(req, res){
  // schema set...
  const user = {
    name: req.body.Name,
    designation:req.body.Desig,
    password:req.body.Password,
    email:req.body.Email,
    mobile_number:req.body.mobileNumber
  };
  // console.log(user);
  User.create(user, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        console.log("from common");
            res.redirect("/login");
      }
    });
});

//post route to  handle the add user querry from the admin route
app.post("/add_user:ID", function(req, res){
  // console.log("adminsss");
  // schema set...
  const user = {
    name: req.body.Name,
    designation:req.body.Desig,
    password:req.body.Password,
    email:req.body.Email,
    mobile_number:req.body.mobileNumber
  };
  // console.log(user);
  User.create(user, function(err, result) {
      if (err) {
        res.send(err);
      } else {
          res.redirect("/adminDash"+req.params.ID);
      }
    });
});

//route for the remove user from admin panel
app.post("/removeUser:ID", function(req, res){
  const email=req.body.Email;
  User.deleteOne({ email: email }, function (err) {
    if(err)
      res.redirect("/error_login.html");
  });
  //redirect to admin panel
  res.redirect("/adminDash"+req.params.ID);
});

//route to create match from admin panel
app.post("/createM:ID", function(req, res){
// console.log(req.body.MatchID);
  const newMatchData={
    id:req.body.MatchID,
    series:req.body.Series,
    teams:req.body.Teams,
    venue:req.body.Venue,
    score:"",
    players:"match didnot start"
  };
  const comCreate={
    match_id:req.body.MatchID,
    commentry:[]
  };
    const result = matches.filter(obj => {
      return obj.id === newMatchData.id;
    });
    if(result.length == 0){
      matches.push(newMatchData);
      commentry.push(comCreate);
    }else{
      res.send("match id already exist..");
    }
  //redirect to admin panel
  res.redirect("/adminDash"+req.params.ID);
});


//route to add commentry to match from admin panel
app.post("/AComment:ID", function(req, res){
  // console.log(req.body);
  const result = commentry.filter(obj => {
    let flag=false;
    if(obj.match_id == req.body.MatchID){
      obj.commentry.push(["moderator",req.body.comment]);
      console.log(commentry);
      flag=true;
    }
    return flag;
  });
  if(result == false){
    // console.log("invalid input entry");
    res.send("enter a valid match id");
  }else{
    //redirect to admin panel
    res.redirect("/adminDash"+req.params.ID);
  }
});

//route to update score to match from admin panel
app.post("/UpdateScore:ID", function(req, res){
  console.log(req.body);
  const result = matches.filter(obj => {
    let flag=false;
    // let sample={id:"1",series:"IPL",teams:"CSK VS MI",venue:"Chennai",score:"150/7",players:"player1:20*   player2:30"};
    if(obj.id == req.body.MatchID){
      obj.score=req.body.score;
      obj.players=req.body.players;
      console.log(commentry);
      flag=true;
    }
    return flag;
  });
  if(result == false){
    // console.log("invalid input entry");
    res.send("enter a valid match id");
  }else{
    // redirect to admin panel
    res.redirect("/adminDash"+req.params.ID);
  }
});

//route to remove match to match from admin panel
app.post("/deleteMatch:ID", function(req, res){
  // console.log(req.body);
  matches = matches.filter(function( obj ) {
    return obj.id != req.body.MatchID;
  });
res.redirect("/adminDash"+req.params.ID);
});
//app running config...
app.listen(process.env.PORT ||3000, function(){
  console.log("Server started on port 3000");
});
