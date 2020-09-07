// Global variables and Reference to DOM elements go here
// stores the reference to the <form> element
var userFormEl = document.querySelector("#user-form");
// stores the reference to the <input> element
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// function that displays the repos. expects an array and a search term to be passed into function.
var displayRepos = function(repos, searchTerm) {

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    console.log(repos);
    console.log(searchTerm);

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos array
    for (var i = 0; i < repos.length; i++) {
        // start set of code that creates the divs to hold each repo's information
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);
        // end set of code that creates the divs to hold each repo's information

        // start set of code that adds a status to the repo's requiring help first
        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class = 'fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);
        // end set of code to add status

        // final display
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}

// function to get data from github.  expects a username to be passed into function.
// user input from form submission is passed into the function as "user"
var getUserRepos = function(user) {
    // format the github api url to the user-requested username
    // we are specifically calling out the repo data url as our starting point
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // fetches the repo data with the formatted url.
    // the url responds with data in the form of a promise, which is in an array
    // the response is via the then() method that is input to the response variable
    // the promise is an object representing eventual completion or failure of an asynchonous computation.
    fetch(apiUrl)
        .then(function(response) {
            // handles the error caused if user does not exist
            // the ok property is a bundled response in fetch()
            if (response.ok) {
            // the resulting object in the response variable is formatted to JSON and is input to the data variable
                // JSON is a format that we can understand.
                // See 6.1.5 //
                response.json().then(function(data) {
                    // the resulting 'data' variable and original search term of 'user' is input into this function
                    displayRepos(data, user);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // .catch is fetch api's way of handling network errors.
        .catch(function(error) {
            // Notice this .catch() getting chained onto the end of the .then() method
            alert("Unable to connect to GitHub");
        });

    console.log("outside");
};

// function that is executed upon a form submission browser event
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    // sets username to the value input by the user
    var username = nameInputEl.value.trim();

    // input is passed to getUserRepos function then clear the form
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

// event listener for submission of form
userFormEl.addEventListener("submit", formSubmitHandler);