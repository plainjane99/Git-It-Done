// reference to the issues container
var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};

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
// getRepoIssues("facebook/react");
// getRepoIssues("plainjane99/git-it-done");
getRepoIssues("plainjane99/run_buddy");