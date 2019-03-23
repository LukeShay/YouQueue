var searchParams = {
    apiKey : "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    previousInput : null,
    currentInput : null
}


var addSearchListener = () =>
{
    var searchBar = document.getElementById("searchBox");
    searchBar.addEventListener("keyup", 
        (event) => 
        {
            if (event.key === "Enter")
            {
                searchParams.currentInput = searchBar.value;

                if (searchParams.currentInput != "" && searchParams.previousInput != searchParams.currentInput)
                {
                    searchParams.previousInput = searchParams.currentInput;
                    APISearch(searchParams.currentInput);
                }
            }
        }
    );
}

var APISearch = (searchTerm) =>
{
    const Http = new XMLHttpRequest();
    const url = 'https://www.googleapis.com/youtube/v3/search?'+
                'part=snippet'+
                '&max-results=10'+
                `&q=${searchTerm}`+
                '&order=viewCount'+
                '&type=video'+
                '&videoDefinition=high'+
                `&key=${searchParams.apiKey}`;

    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange =(e)=>{
    console.log(JSON.parse(Http.responseText));
    }
}