var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // this line logs the array of repo data that we are targeting.  See 6.1.5 // 
        response.json().then(function(data) {
            console.log(data);
        });
    });

    console.log("outside");
};

getUserRepos("plainjane99");