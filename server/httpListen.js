const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/', function(req, res) {
  var id = req.body.ID;
  
  ytdl(`https://www.youtube.com/watch?v=${id}`).pipe(fs.createWriteStream(`public/${id}.mp4`));
  var pathname = `${id}.mp4`;
  res.send("audio ready");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

