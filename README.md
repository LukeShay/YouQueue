# YouQueue

Chrome extension used to play music while you are using the browser. There are directions online on how to install extensions onto your browser. You also need a Firebase account as well to enable the full functionality of the extension. Without a firebase account, you can still listen to music.

## Features

The basic functionality of YouQueue is to queue music. You can also create an account if you want to save queues and be able to play them later. Since this is a queue, you must listen to the songs in order but you can skip them. To be able to create accounts and save queues, you need to link the javascript code to a Firebase project. There are pages for logging in/creating an account, making and saving queues, and the default page which shows the current queue.

### The main queue 
The main page of the extension is the current queue. The main page shows the songs in order and the thumbnail of the current song playing. This extension uses the YouTube API in order to search for the songs and fetch the songs and their thumbnail. The songs are downloaded using a locally hosted server then the song is played. You can pause, skip, and clear the current queue.

### Login/Signup page
Logging in and signing up is all handled using the Firebase API. The use is pretty straight forward. When someone creates an account their information is saved in Firebase and there is a database table created for that user which holds the saved queues.

### Saved queues page
After creating an account, you can save queues, edit them, and select them to play. This uses the Firebase API as well to do the background work. Each user has there own object in the database. The database is NoSQL format so it just passes json objects back and forth. Each queue name is a key inside their object and the value consists of and object of video id and title pairs. The video id is used later to fetch the song.

## Technologies used
* Javascript
* Chrome API
* Storage API
* SASS
* YouTube API
* Firebase API
* HTML5
* Git
