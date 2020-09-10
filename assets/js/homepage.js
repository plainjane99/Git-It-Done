// Global variables and Reference to DOM elements go here
// stores the reference to the <form> element for the event listener
var userFormEl = document.querySelector("#user-form");
// stores the reference to the <input> element in which the user fills a value
var nameInputEl = document.querySelector("#username");
// stores the reference to the column in which we will display the repo data
var repoContainerEl = document.querySelector("#repos-container");
// stores the reference to the line in which we will display the user name
var repoSearchTerm = document.querySelector("#repo-search-term");
// stores the reference to the buttons for the code languages
var languageButtonsEl = document.querySelector("#language-buttons");

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

        // create a link container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // add the href attribute with url extension to home url
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

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
    // we are specifically calling out the repo data url as our "endpoint"
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
            // json string to an object
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

// accepts a language paramater, creates and API endpoint, and makes an http request to that endpoint
var getFeaturedRepos = function(language) {
    // making this url the endpoint 
    // this endpoint allows searching on a specific code and is a featured github page
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    // fetch to the endpoint we created
    fetch(apiUrl).then(function(response) {
        // handles the error caused if xxxxxxxxxxxx
        // the ok property is a bundled response in fetch()
        if (response.ok) {
            // json string to an object
            // the resulting object in the response variable is formatted to JSON and is input to the data variable
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

// function that handles the click events
// we will use event delegation rather than creating click listeners for each button
// we will delegate click handling on these elements to their parent elements
var buttonClickHandler = function(event) {
    // the browser's event object had a target property that tells us exactly which html element was interacted with to create the event
    // the getAttribute method reads the data-language attribute's value assigned to the element
    var language = event.target.getAttribute("data-language");
    console.log(language);

    if (language) {
        // calls the featured repo function and passes the user-selected language to that function
        getFeaturedRepos(language);
        // clear old content
        repoContainerEl.textContent = "";
    }
}

// event listener for submission of form
userFormEl.addEventListener("submit", formSubmitHandler);

// event listener added to the div element that will call a handler function
languageButtonsEl.addEventListener("click", buttonClickHandler);