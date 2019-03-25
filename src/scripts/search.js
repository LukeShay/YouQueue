var searchParams = {
    apiKey : "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    previousInput : null,
    currentInput : null,
    currentVideo : null
}


var addSearchListener = () =>
{
    var searchBar = document.getElementById("searchBox");
    searchBar.addEventListener("keyup", 
        (event) => 
        {
            if (event.key === "Enter")
            {
              APISearch(searchBar.value);
            }
        }
    );
}

var APISearch = (searchTerm) =>
{
    const Http = new XMLHttpRequest();
    const url = 'https://www.googleapis.com/youtube/v3/search?'+
                'part=snippet'+
                '&max-results=1'+
                `&q=${searchTerm}`+
                '&order=viewCount'+
                '&type=video'+
                '&videoDefinition=high'+
                `&key=${searchParams.apiKey}`;

    Http.responseType = 'json';
    Http.open("GET", url, true);
    Http.send();
    Http.onload =(e)=>
    {
      var videoID = Http.response.items[2].id.videoId;
      console.log(Http.response);
      currentVideo = videoID;
        
      player.loadVideoById({videoId: videoID,
        startSeconds:0,
        endSeconds:0,
        origin: "http://www.youtube.com"
      });
    
    };
}


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: searchParams.currentVideo,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}