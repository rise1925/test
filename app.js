var express = require('express');
var http = require('http');
var path = require('path');
var bodyParaser = require('body-parser');
var mysql = require('mysql');

const { callbackify } = require('util');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "eg39315",
  database:"management"
});
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));

app.get('/process/login', function(req, res) {  
    var paramId = req.param('id');
    var sen_v = req.param('sensor');
    console.log('/precess/login 처리, id: '+ paramId + " / " + sen_v);
    var sql = "INSERT INTO management.arduino_parking_lot (name, parking) VALUES ('제 1 주차장', "+sen_v+");"
    pool.getConnection(function(err, con) {
        if (err) {
            console.log(err)
            con.release();    
        }else{
            console.log("Connected!");
            con.query(sql, function (err, result) {
                console.log(JSON.stringify(result));
            });   
            con.release();         
        }        
      });      
    res.write("Success");
    res.end();
});

app.post('/index', function(req, res) {  
    var sql = "SELECT no, name, parking, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s')date FROM management.arduino_parking_lot order by no desc limit 10;";
        pool.getConnection(function(err, con) {
            if (err) {
                console.log(err)
                con.release();    
            }else{
                con.query(sql, function (err, rows) { 
                    if(err){
                        console.log(err)
                        con.release();    
                    }else{
                        var message = {
                            message1: rows
                          }
                          res.getHeader('content-type');
                          res.status(200).json(message);
                    }   
                });   
                con.release();         
            }        
        });   
});

app.get('/', function(req, res) {
    res.render('index');
});

var server = app.listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
    