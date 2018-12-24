var app = new (require('express'))();
const fileUpload = require('express-fileupload');
var port = 3000

app.use(fileUpload());

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(sampleFile.name);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./uploaded/'+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("Open up http://localhost:%s/ in your browser.", port, port)
  }
});
