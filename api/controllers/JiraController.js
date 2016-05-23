/**
 * JiraController
 *
 * @description :: Server-side logic for managing Jiras
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/*/
    REST API NEEDS TO BE WRITTEN AS A SERVICE
/*/


module.exports = {
    
    getJIRAStoryByKey: function(storyKey) {
        var endpoint = "/rest/api/2/search?jql=key=" + storyKey;
        return doRequest(endpoint, "GET");
    },
    
    
    doRequest: function(endpoint, method) {
        var username = sails.config.jira.apiUser;
        var password = sails.config.jira.apiPass;
        authKey = new Buffer(username + ":" + password).toString('base64');
        
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
                res.serverError(err);
            });

            response.on('end', function(){
                try {
                    // response available as `responseData` in `yourview`
                    // res.locals.requestData = JSON.parse(responseData);
                    return data = JSON.parse(responseData);
                } catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e);
                }
                
                //res.view('jiratest');
            }); 

        }).end()
    },

    test2: function(req, res) {
        
       var data = this.getJIRAStoryByKey("OAS-200");
       res.locals.requestData = data;
       res.view('jiratest');
        
    },

    test: function(req, res) {
        var https = require('https');
        var https = require('https'), options = {
            host : "redantinternal.atlassian.net",
            port : 443,
            path : "/rest/api/2/search?jql=key=OAS-200",
            method : 'GET',
            headers: { "Authorization": "Basic bHVrZS5oYW1tb25kOnBsMGszcjEyMw==" }
        };
    
        https.request(options, function(response) {
            var responseData = '';
            response.setEncoding('utf8');

            response.on('data', function(chunk){
                responseData += chunk;
            });

            response.once('error', function(err){
                // Some error handling here, e.g.:
                res.serverError(err);
            });

            response.on('end', function(){
                try {
                    // response available as `responseData` in `yourview`
                    res.locals.requestData = JSON.parse(responseData);
                } catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e);
                }
                
                res.view('jiratest');
            }); 

        }).end()
        
    }
}; 

