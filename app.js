var mysql = require('mysql');
var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
const bcrypt = require("bcrypt");
const saltRounds =10;



var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sunil@123',
  database : 'night_canteen',
  insecureAuth:true
});


var app=express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());

con.connect(function(err){
  if(err){
    console.log(err);
  };
    console.log("connected my_sql");
});

app.get('/', function(req, res) {
	res.render("index");
});

app.get('/signup', function(req, res) {
	res.render("signup");
});

app.get('/login', function(req, res) {
	res.render("login");
});

app.get('/contactus', function(req, res) {
	res.render("contactus");
});

app.get('/menu', function(req, res) {
	res.render("menu");
});

app.get('/infoI', function(req, res) {
	res.render("infoI");
});

app.get('/infoII', function(req, res) {
	res.render("infoII");
});

app.post("/signup", function(req,res){
  const username=req.body.Username;
  const block=req.body.Block;
  const phone=req.body.phone;
  const password=req.body.password;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    var sql7 = "insert into users (username,Block,Phone,password) values("+"\""+username+"\", \""+block+"\", \""+phone+"\", \""+hash+ "\")";
    con.query(sql7,function(err,result){
      if(err){
        res.send("There already exits an account with this mobile number.");
        console.log(err);
      }
      else{
        res.redirect("/login");
      }
    });
  });
});


app.post("/login", function(req,res){
  let username = req.body.username;
  let pass = req.body.password;
  let sql11 = "select count(*) as count from users where Username = "+"\"" + username+"\"";
  con.query(sql11,function(err, result){
    if(err){
       console.log(err);
     }
     else{
       let un =result[0].count;
       if(un==0){
         res.send("Invalild Username or password");
       }
       else{
         let sql12 = "select password  from users where Username="+"\""+username+"\"";
         con.query(sql12,function(err, result){
           if(err){
              console.log(err);
            }
            else{
              bcrypt.compare(pass, result[0].password, function(err, result) {
                if(result === true){
                  res.redirect("/menu");
                 }
                else{
                  res.send("Wrong password");
                }
              });
            }
          });
       }
     }
   });

});

app.post("/menu", function(req,res){
  console.log(req.body);
  res.redirect("/infoII");
});

app.post("/infoII", function(req,res){
  console.log(req.body);
  res.redirect("/");
});

app.get('/home.html', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000,function(){
  console.log("Server is running on port 3000");
});
