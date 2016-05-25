



module.exports = {
    
    getJIRAStoryByKey: function(storyKey, cb) {
        var endpoint = "/rest/api/2/search?jql=key=" + storyKey;
        return this.doRequest(endpoint, "GET", cb);
    },
    
    getJIRAStoriesByProjectKey: function(projectKey, cb) {
        var endpoint = "/rest/api/2/search?jql=project=" + projectKey + "%20AND%20issuetype=story&maxResults=9999&fields=key";
        return this.doRequest(endpoint, "GET", cb);
    },
    
    
    doRequest: function(endpoint, method, cb) {
        /********************************************************************************************************************************
        // JIRA 'Basic' Authentication accepts username:password values as credentials located in config/jira.js.
        // Contents of config/jira.js = apiUser: "username", apiPass: "password" and file will need to be generated if it does not exist.
        // See JIRA documentation here: https://docs.atlassian.com/jira/REST/latest/
        /********************************************************************************************************************************/
        var username = sails.config.jira.apiUser;
        var password = sails.config.jira.apiPass;
        authKey = new Buffer(username + ":" + password).toString('base64');
        
        // Connect to the JIRA API via https REST Stream.
        
        var https = require('https');
        var https = require('https'), options = {
            host : "redantinternal.atlassian.net",
            port : 443,
            path : endpoint,
            method : method,
            headers: { "Authorization": "Basic " + authKey }
        };
        
        https.request(options, function(response) {
            var responseData = '';
            response.setEncoding('utf8');

            response.on('data', function(chunk){
                responseData += chunk;
            });

            response.once('error', function(err){
                // Some error handling here, e.g.:
                cb.error(err);
                res.serverError(err);
            });

            response.on('end', function(){
                try {
                    // response available as `responseData` in `yourview`
                    // res.locals.requestData = JSON.parse(responseData);
                    
                    // Return the requested JSON back to the controller via data
                    var restData;
                    restData = JSON.parse(responseData);
                    cb.success(restData);
                    return restData;
                } catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e + ' [location: api/services/Jira.js]');
                }
            }); 

        }).end()
    }
    
}