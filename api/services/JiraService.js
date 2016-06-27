



module.exports = {
    
    
    // For most endpoints, there are a number of parameters that can be set as follows:
    // @maxResults = integer (max 1000)
    // @fields = string (comma delimeted string of field names, no spaces)
    
    //************************//
    
    // Endpoint for fetching the Board ID - required for fetching sprints:
    // /rest/agile/latest/board/?name=oasis
    
    getJIRABoards: function(projectName, next) {
        var endpoint = '';
        if(projectName.length == 0) {
            endpoint = "/rest/agile/latest/board/?maxResults=1000";
        } else {
            // Get the first word of the project name to use in board name
            var projectNameParts = projectName.split(" ");
            var projectName = projectNameParts[0];         
            endpoint = "/rest/agile/latest/board/?name=" + projectName;
        }
        return this.doRequest(endpoint, "GET", next);
    },
    
    // Endpoint for fetching sprints based on Board ID:
    // /rest/agile/latest/board/176/sprint
    
    getJIRASprints: function(boardId, next) {
        var endpoint = "/rest/agile/latest/board/" + boardId + "/sprint/";
        return this.doRequest(endpoint, "GET", next);
    },

    // Endpoint for retrieving stories by sprint
    // /rest/api/2/search?jql=sprint=580 AND issuetype=story

    getJIRAStoriesBySprint: function(sprintId, next) {
        var endpoint = "/rest/api/2/search?jql=sprint=" + sprintId + "%20AND%20issuetype=story&maxResults=9999" //& fields=key,summary,priority,status";
        return this.doRequest(endpoint, "GET", next);
    },
    
    // Endpoint for fetching an issue by key
    // /rest/api/search?jql=key=OAS-1
    
    getJIRAStoryByKey: function(storyKey, next) {
        var endpoint = "/rest/api/2/search?jql=key=" + storyKey;
        return this.doRequest(endpoint, "GET", next);
    },
    
    // Endpoint for fetching stories by key
    // /rest/api/2/search?jql=project=OAS AND issuetype=story
    
    getJIRAStoriesByProjectKey: function(projectKey, next) {
        var endpoint = "/rest/api/2/search?jql=project=" + projectKey + "%20AND%20issuetype=story&maxResults=9999&fields=key,summary,priority,status";
        return this.doRequest(endpoint, "GET", next);
    },

    // Endpoint for fetching Stories by Project Key and SprintName
    // /rest/api/2/search?jql=project=OAS AND sprint=Oasis Sprint 1 AND issuetype=story
    
    getJIRAStoriesByProjectKeySprintName: function(projectKey, sprintName, next) {
        var endpoints = "/rest/api/2/search?jql=project=" + projectKey + "%20AND%20sprint='" + sprintName + "'%20AND%20issuetype=story&maxResults=9999&fields=key,summaray,priority,status";
        return this.doRequest(endpoints, "GET", next);
    },
    
    
    // Method for conducting the fetch.
    // Returns data from based on the endpoint provided if successful
    // Returns an error if cannot establish a connection or there is another problem
    
    doRequest: function(endpoint, method, next) {

        /********************************************************************************************************************************
        // JIRA 'Basic' Authentication accepts username:password values as credentials located in config/jira.js.
        // Contents of config/jira.js:
        // apiUser: "username", apiPass: "password", apiHost: "hostname", apiPort: 443
        // File will need to be created manually if it does not exist for security purposes [i.e. do not upload to public repository]
        // See JIRA documentation here: https://docs.atlassian.com/jira/REST/latest/
        /********************************************************************************************************************************/

        var username = sails.config.jira.apiUser;
        var password = sails.config.jira.apiPass;

        authKey = new Buffer(username + ":" + password).toString('base64');
        
        // Connect to the JIRA API via https REST Stream.
        
        var https = require('https');
        var https = require('https'), options = {
            host : sails.config.jira.apiHost,
            port : sails.config.jira.apiPort,
            path : endpoint,
            method : method,
            headers: { "Authorization": "Basic " + authKey }
        };
    
        var req = https.request(options, function(response) {
            var responseData = '';
            response.setEncoding('utf8');

            response.on('data', function(chunk){
                responseData += chunk;
            });


            response.on('end', function(){
                try {
                    // Return the requested JSON back to the controller via data
                    var restData = JSON.parse(responseData);
                    next.success(restData);
                } catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e + ' [location: api/services/Jira.js]');
                }
            }); 

        })
        
        req.end();

        req.on('error', function(err){
            // console.log(err);
            // Some error handling here, e.g.:
            next.error(err);
        });
        
    }
    
}