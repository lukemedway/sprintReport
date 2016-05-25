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
    
    test2: function(req, res) {
       var data = Jira.getJIRAStoryByKey("OAS-200", {
            success: function(data) {
                res.locals.requestData = data;
                res.view('jiratest2');
            },
            error: function(err) {
                console.log('ERROR: getJIRAStoryByKey Service Method CB');
            }
       });
    },
    
    test3: function(req, res) {
        var data = Jira.getJIRAStoriesByProjectKey("OAS", {
           success: function(data) {
               res.locals.requestData = data;
               res.view('jiratest3');
           },
           error: function(err) {
               console.log('ERROR: getStoriesByProjectKey Service Method CB.');
           }
        });
    }
    
    
    /**************************************************************
     * 
     * 
     **************************************************************
    
    test: function(req, res) {
        var https = require('https');
        var https = require('https'), options = {
            host : "redantinternal.atlassian.net",
            port : 443,
            path : "/rest/api/2/search?jql=key=OAS-200",
            method : 'GET',
            headers: { "Authorization": "Basic ###" }
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
    */
}; 

