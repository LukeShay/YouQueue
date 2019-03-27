const fs = require('fs');
const ytdl = require('ytdl-core');


function download(key){
    ytdl('https://www.youtube.com/watch?v=' + key, {filter: ('audioonly')})
  .pipe(fs.createWriteStream('audioVideo.mp3'));
}