/**
 * JiraController
 *
 * @description :: Server-side logic for managing Jiras
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {
    
    getkeys: function(req, res) {
        var data = JiraService.getJIRAStoriesByProjectKey(req.param('id'), {
           success: function(data) {
               res.send(200, data);
           },
           error: function(err) {
               console.log('ERROR: getStoriesByProjectKey Service Method CB');
           }
        });
    },
    
    getstory: function(req, res) {
        if (req.param('id') !== null) {
            var data = JiraService.getJIRAStoryByKey(req.param('id'), {
                success: function(data) {
                    res.send(200, data);
                },
                error: function(err) {
                    console.log('ERROR: getstory Service Method CB');
                }
            });
        } else {
            return false;
        }
    },
    
    
    // {host}/rest/agile/latest/board/?name=Oasis
    fetchjiraboards: function(req, res, next) {
        JiraService.getJIRABoards(req.param('name'), {
            success: function(boardData) {
                res.json(boardData);
            },
            error: function(err) {
                res.send(500, err);
            }
        })
    },

    // {host}/rest/agile/latest/board/176/sprint
    fetchjirastoriesbysprint: function(req, res, next) {
        JiraService.getJIRAStoriesBySprint(req.param('sprintid'), {
            success: function(stories) {
                res.json(stories.issues);
            },
            error: function(err) {
                res.send(500, err);
            }
        })
    },
    

    // {host}/rest/agile/latest/board/176/sprint
    fetchdonejirastoriesbysprint: function(req, res, next) {
        JiraService.getDoneJIRAStoriesBySprint(req.param('sprintid'), {
            success: function(stories) {
                res.json(stories.issues);
            },
            error: function(err) {
                res.send(500, err);
            }
        })
    },
    
    // test2: function(req, res) {
    //    var data = JiraService.getJIRAStoryByKey("OAS-200", {
    //         success: function(data) {
    //             res.locals.requestData = data;
    //             res.view('jiratest2');
    //         },
    //         error: function(err) {
    //             console.log('ERROR: getJIRAStoryByKey Service Method CB');
    //         }
    //    });
    // },
    
    test3: function(req, res) {
        var data = JiraService.getJIRAStoriesByProjectKey("OAS", {
           success: function(data) {
               res.locals.requestData = data;
               var arrScripts = [ "sprint-dependencies.js", "data-table.js" ];
               res.view('jiratest3', { scripts: arrScripts });
           },
           error: function(err) {
               console.log('ERROR: getStoriesByProjectKey Service Method CB');
           }
        });
    }
    
}; 

