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
    console.log("INSERT into comments(Description, userId, recordingId) values("+req.body.description + ',' + req.body.userId + ',' + req.body.recordingId+")");
    connection.query("INSERT into comments(Description, userId, recordingId) values('"+req.body.description + "'," + req.body.userId + ',' + req.body.recordingId+")", function(err){
    if (err) throw err;
  res.send({statusCode: '200', status: "success"})
  });
    
  }
  login(req, res)
  {
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    console.log(email + " " + password);
    connection.query('SELECT email, password, id from accounts where email = "'+ email +'" AND password = "'+ password +'"', function (err, rows, fields) {
    if (err) return res.status(500).send(err);
    console.log("Rows: " + rows)
    if (rows.length > 0)
    {
    let token = jwt.sign({username: email},
        config.secret,
        { 
          expiresIn: '24h' // expires in 24 hours
        }
      );
      res.json({
        success: true,
        message: 'Authentication successful!',
        token: token,
        userId: rows[0].id
      });
    }
    else
        res.send(
    {
      "email": email,
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
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    console.log(req.files);
    let sampleFile = req.files.sampleFile;
    //console.log(sampleFile.name);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./uploaded/'+sampleFile.name, function(err) 
    {
      if (err)
        return res.status(500).send(err);
      connection.query(`INSERT INTO recordings (name, userId) values (` + sampleFile.name + `, 1)`,function(err,rows,fields)
      {
        if (err) return res.status(500).send(err);
        res.send('File uploaded!');
      });
    });
  }

  userFiles(req,res)
  {
    connection.query('SELECT name, email from recordings join accounts where recordings.userId = accounts.id AND  AND accounts.id = '+ req.params.userId, function (err, rows, fields) 
    {
      if (err) return res.status(500).send(err);
    
      console.log('The solution is: ', rows)
      res.send(rows);
    });
  }

  deleteFile(req,res)
  {
    connection.query("SELECT name from recordings where recording.id="+ req.params.fileId, function(err, rows, fields)
    {
      fs.unlink(rows[0].name, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        connection.query("UPDATE `vrpiano`.`recordings` SET `isDeleted` = 1 WHERE `id` = " + req.params.fileId);
        console.log('File deleted!');
    }
  );

  });  
  }
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port 	   : '3306',
  password : '',
  database : 'vrpiano'
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
  connection.query('SELECT name, email, recordings.id from recordings join accounts where recordings.userId = accounts.id', function (err, rows, fields) {
    if (err) return res.status(500).send(err);
  
    console.log('The solution is: ', rows)
    res.send(rows);
  })
  });
  
  app.get("/getFileList/:userId", middleware.checkToken, handlers.userFiles);

  app.delete("/deleteFile/:fileId", middleware.checkToken, handlers.deleteFile);

  app.get("/getFile/:filename", function(req, res) {
    res.sendFile(__dirname + '/uploaded/' + req.params.filename);
  });
  
  app.post('/upload', middleware.checkToken, handlers.upload);
  
  app.post('/comments/', handlers.comment);

  app.get('/comments/:id',function(req,res){
    connection.query("select * from comments where comments.recordingId="+req.params.id,function(err,rows,fields)
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