// reference to the issues container in order to add looped issues
var issueContainerEl = document.querySelector("#issues-container");
// reference to the limit warning container in order to display warning
var limitWarningEl = document.querySelector("#limit-warning");
// reference to the repo-name container in order to add a repo name to the header
var repoNameEl = document.querySelector("#repo-name");

// function to get the repo name from the url of this page
// the url of this page is an extension + a query extension to the base page
var getRepoName = function() {
    // Location Web API is a browser-based tool that will help us retrieve the query parameter
    // the location object is a property of the document object
    // search is a property of the location object and represents the query string
    // create a variable to hold the query string
    var queryString = document.location.search;
    // split the query string at the = character to parse out the query extension search parameter
    // split will split the extension into two pieces so we are using index 1 to retrieve the second piece
    var repoName = queryString.split("=")[1];

    // if repoName is truthy, i.e. repoName given
    if (repoName) {
        // appends the header with the repo name
        repoNameEl.textContent = repoName;
        // calls this function to get the repo issues based off of repo name
        getRepoIssues(repoName);
    }
    // if repoName was not given, redirect to home page
    else {
        document.location.replace("./index.html");
    }
}

// function that fetches repo issues
var getRepoIssues = function(repo) {

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // checks for the "link" header to determine if there are more than 30 issues
                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            document.location.replace("./index.html");
        }
    });
};

// function that displays issues for repo
var displayIssues = function(issues) {
    // account for the possibility that there are no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    // loop over the response data (which is an array of issues) and create a <a> element for each issue
    for (var i = 0; i < issues.length; i++) {
        // create an empty container with attributes then add content to that empty container

        // creates the empty link element to take users to the issue on github
        // this creates the <a> element name issueEl
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // this links to the html_url property within each issue's object
        issueEl.setAttribute("href", issues[i].html_url);
        // this opens a new tab instead of replacing the current webpage
        issueEl.setAttribute("target", "_blank");

        // adds the content to the empty <a> element
        // create span to hold issue title
        var titleEl = document.createElement("span");
        // assigns title property as text content
        titleEl.textContent = issues[i].title;
        // append title to container
        issueEl.appendChild(titleEl);

        // create a type element for issue vs pull request
        var typeEl = document.createElement("span");
        // check if issue is an actual issue or a pull request
        // truthy that issue is a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // append type to container
        issueEl.appendChild(typeEl);

        // finally append newly created container to html id container so that it will display
        issueContainerEl.appendChild(issueEl);
    }
};

// function to create warning if issues exceeds 30
var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create a link and format the site to visit
    // create an <a> element for the link
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();