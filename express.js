var app = new (require('express'))();
const fileUpload = require('express-fileupload');
var PORT = process.env.PORT || 5000;
var fs = require('fs');
//db connection
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port 	   : '3306',
  password : '',
  database : 'vrpiano'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

connection.connect();



app.use(fileUpload());

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})



app.get("/getFileList", function(req, res) {
connection.query('SELECT name, email from recordings join accounts where recordings.userId = accounts.id', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows)
  res.send(rows);
})
});

app.get("/getFile/:filename", function(req, res) {
res.sendFile(__dirname + '/uploaded/' + req.params.filename);
});

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  console.log(req.files);
  let sampleFile = req.files.sampleFile;
  //console.log(sampleFile.name);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./uploaded/'+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("Open up http://localhost:%s/ in your browser.", PORT, PORT)
  }
});