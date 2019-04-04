const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const url = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');


const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(express.static('public'));


app.post('/', function(req, res) {
  var id = req.body.ID;
  
  ytdl(`https://www.youtube.com/watch?v=${id}`).pipe(fs.createWriteStream(`public/${id}.mp4`));
  var pathname = `${id}.mp4`;
  res.send("audio ready");

    /* fs.exists(pathname, function (exist) {
        if(!exist) {
          // if the file is not found, return 404
          res.statusCode = 404;
          res.send(`File ${pathname} not found!`);
          return;
        }
    
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
          pathname += '/index.html';
        }
    
        // read file from file system
        fs.readFile(pathname, function(err, data){
          if(err){
            res.statusCode = 500;
            res.send(`Error getting the file: ${err}.`);
          } else {
            // based on the URL path, extract the file extention. e.g. .js, .doc, ...
            const ext = path.parse(pathname).ext;
            // if the file is found, set Content-type and send data
            res.set('Content-type', 'audio.mpeg');
            res.send(data);
          }
        });
    }); */
});

/* app.get('/', (req, res) => {
    var id = req.body;
    console.log(id);
    
    
}); */

app.listen(3000, () => console.log('Example app listening on port 3000!'));

