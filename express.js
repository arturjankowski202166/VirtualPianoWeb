/*const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
var PORT = 5000;


express().use(fileUpload());

express().get("/", (req, res)) {
  res.sendFile(__dirname + '/index.html')
})

express().get("/test", function(req, res) {
  res.send('test');
})

express().use(express.static(path.join(__dirname, 'public')))
 .set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

express().post('/upload', function(req, res) {
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

express().listen(PORT, () => console.log(`Listening on ${ PORT }`));*/
var app = new (require('express'))();
const fileUpload = require('express-fileupload');
var PORT = 5000

app.use(fileUpload());

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


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