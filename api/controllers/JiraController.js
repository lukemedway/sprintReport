/**
 * JiraController
 *
 * @description :: Server-side logic for managing Jiras
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {
    
    getkeys: function(req, res) {
        var data = Jira.getJIRAStoriesByProjectKey("OAS", {
           success: function(data) {
               res.send(200, data);
           },
           error: function(err) {
               console.log('ERROR: getStoriesByProjectKey Service Method CB.');
           }
        });  
    },
    
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
    
}; 

