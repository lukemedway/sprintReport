/**
 * SprintsController
 *
 * @description :: Server-side logic for managing sprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Projects = require('./ProjectsController');

module.exports = {
	
    index: function(req, res) {
        //console.log("id:" + req.param('id'));
        Projects.getProjectById(req.param('id'), {
            success: function(data) {
              console.log(data);
              res.json(data);
            },
            error: function(err) {
                console.log('ERROR with ProjectsController.getProjectByID: ' + err);
                res.send(500, err);
            },
            notFound: function(str) {
                console.log(str);
                res.send(200, str);
            }
        });
        
        //     if(err) return next(err);
        //     if(!project) return next();
        //     console.log("hello");
        //     res.view();
        // });
        
        


        // Sprints.find().sort({ 'createdAt': -1 }).exec(function foundSprints(err, sprints){
        //     if(err) return next(err);
        //     if(!sprints) return next();
        //     var arrScripts = [ "sprints-data.js" ];
        //     res.view({ 
        //         title: sprints.projectname + " Sprints List",
        //         scripts: arrScripts, 
        //         sprints: sprints
        //     });
        // });

        
       
    }
    
};

