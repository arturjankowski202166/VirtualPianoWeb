var app = new (require('express'))();
const fileUpload = require('express-fileupload');
var PORT = process.env.PORT || 5000;
var fs = require('fs');
//db connection
let jwt = require('jsonwebtoken');
const config = require('./express.config.js');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var middleware = require('./middleware');


class HandlerGenerator
{
  comment(req,res)
  {
    let userId = req.decoded.id;
      connection.query("INSERT into comments(Description, userId, recordingId) values('"+req.body.description + "'," + userId + ',' + req.body.recordingId+")", function(err){
      if (err) throw err;
    res.send({statusCode: '200', status: "success"})
    });   
  }
  
  login(req, res)
  {
    let email = req.body.email;
    let password = req.body.password;
    connection.query('SELECT email, password, id from accounts where email = "'+ email +'" AND password = "'+ password +'"', function (err, rows, fields) {
      if (err) return res.status(500).send(err);
      if (rows.length > 0)
      {
        let token = jwt.sign({username: email, id: rows[0].id},
            config.secret,
            { 
              expiresIn: '24h' // expires in 24 hours
            }
          );
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token,
          userId: rows[0].id,
          access: true
        });
      }
      else
          res.send(
      {
        success: true,
        message: "Authentication failed",
        "access": false 
      });
    });
  }

  upload(req, res)
  {
    if (Object.keys(req.files).length == 0) 
    {
      return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.sampleFile;
      sampleFile.mv('./uploaded/'+sampleFile.name, function(err) 
    {
		console.log(req.files.id);
      if (err)
        if (err){ console.log(err); return res.status(500).send(err);}
      connection.query(`INSERT INTO recordings (name, userId) values ('` + sampleFile.name + `', `+ req.decoded.id + `)`,function(err,rows,fields)
      {
        if (err){ console.log(err); return res.status(500).send(err);}
        res.send('File uploaded!');
      });
    });
  }

  userFiles(req,res)
  {
    connection.query('SELECT name, email, recordings.id from recordings join accounts where recordings.userId = accounts.id AND recordings.isDeleted = 0 AND accounts.id = '+ req.decoded.id, function (err, rows, fields) 
    {
      if (err) return res.status(500).send(err);
    
      console.log('The solution is: ', rows)
      res.send(rows);
    });
  }

  deleteFile(req,res)
  {
    console.log("GOT DELETE REQUEST "+req.params.fileId);
  connection.query("SELECT name from recordings where recordings.id="+ req.params.fileId, function(err, rows, fields)
    {
      fs.unlink("./uploaded/"+rows[0].name, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        connection.query("UPDATE `vrpiano`.`recordings` SET `isDeleted` = 1 WHERE `id` = " + req.params.fileId);
          console.log('File deleted!');
          res.send({status: "success", message: "File deleted"})
        }
      );
    });
  }

  addUpvote(req,res){
      let ownerId = req.decoded.id;
      let exists = false;
      console.log("RECEIVED RECORDINGID " + req.body.recordingId);
      connection.query("select * from upvotes", function(err, rows, fields){
        if(err) res.send(err);
        for (let i = 0; i < rows.length; i++)
        {
          console.log("ROW: "+ rows[i].userId + " " + rows[i].recordingId);
          if(rows[i].userId == req.decoded.id && rows[i].recordingId == req.body.recordingId)
          {
            exists = true;
          }
        }
        if(exists)
        {
          res.send({status: "success", message: "Already voted"});
        }
        else{
          connection.query("INSERT INTO `vrpiano`.`upvotes`(`userId`,`recordingId`)VALUES("+req.decoded.id+","+req.body.recordingId+" );", function(err, rows, fields){
          if (err) res.send(err)
          res.send({status: "success", message: "Successfuly added vote"});
        })
        }
      });
    }
  }

var connection = mysql.createConnection({
  host     : 'sql7.freemysqlhosting.net',
  user     : 'sql7277385',
  port 	   : '3306',
  password : '6atpuRd9nn',
  database : 'sql7277385'
});
connection.connect();

function main()
{
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(fileUpload());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Request-Headers", "*");
    res.header("Access-Control-Allow-Headers", "Authorization");
    res.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });
  let handlers = new HandlerGenerator();
  console.log(handlers);

  app.post('/login', handlers.login);


  app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
  })
  
  
  
  app.get("/getFileList", function(req, res) {
    connection.query('SELECT name, email, recordings.id from recordings join accounts where recordings.userId = accounts.id AND recordings.isDeleted = 0 ', function (err, rows, fields) {
      if (err) return res.status(500).send(err);
      res.send(rows);
    })
  });
  
  app.get("/getFileList/:userId", middleware.checkToken, handlers.userFiles);

  app.delete("/deleteFile/:fileId", middleware.checkToken, handlers.deleteFile);

  app.get("/getFileInfo/:id", function(req,res)
  {
    connection.query("SELECT name, email, recordings.id from recordings join accounts where recordings.userId = accounts.id AND recordings.isDeleted = 0 AND recordings.id = '"+req.params.id+"'", function(err, rows, fields)
    {
      res.send(rows);
    });
  });

  app.post("/register", function(req,res){
      connection.query("INSERT INTO `vrpiano`.`accounts` (`email`,`password`)VALUES('"+ req.body.email+"','"+req.body.password+"');", function(err,rows,fields)
      {
        if (err) res.send(err);
        res.send({status:'success', info: 'Account created'});
      })
  })

  app.get("/upVotes/:recordingId", function(req,res){
    console.log(req.params.recordingId);
    connection.query("select count(recordingId) as number from upvotes where recordingId = "+req.params.recordingId+";", function(err, rows, fields)
    {
      if (err) res.send(err);
      console.log(rows[0].number);
      res.send({number: rows[0].number});
  });
});

  app.post("/upVotes", middleware.checkToken, handlers.addUpvote);

  app.get("/getFile/:filename", function(req, res) {
    res.sendFile(__dirname + '/uploaded/' + req.params.filename);
  });
  
  app.post('/upload', middleware.checkToken, handlers.upload);
  
  app.post('/comments/', middleware.checkToken, handlers.comment);

  app.get('/comments/:id',function(req,res){
    console.log("GET COMMENTS "+ req.params.id)
    connection.query("select * from comments where comments.recordingId="+req.params.id,function(err,rows,fields)
    {
      res.send(rows);
    });
  });

  app.get('/comments/',function(req,res){
    connection.query("select Description, recordingId, email from comments join accounts where  comments.userId=accounts.id",function(err,rows,fields)
  {
    res.send(rows);
    });
  });
}

app.listen(PORT, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("Open up http://localhost:%s/ in your browser.", PORT, PORT)
  }
});

main();