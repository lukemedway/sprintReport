/**
 * SprintsController
 *
 * @description :: Server-side logic for managing sprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Projects = require('./ProjectsController');

module.exports = {
	
    index: function(req, res) {
        Projects.getProjectById(req.param('id'), {
            success: function(projectData) {
                var arrScripts = ['sprints-data.js'];
                res.view({
                    title: "SPRINTS",
                    scripts: arrScripts,
                    projectData: projectData
                });
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
    },
    
    
    getSprints: function(req, res, next) {
        Sprints.find({ project: req.param("id") }).sort({ 'createdAt': -1 }).exec(function foundSprints(err, sprints) {
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        });       
    },
    
    
    create: function(req, res, next) {
        var projectid = req.param('projectid');
        Sprints.create({ 
            sprintname: req.param('sprintname'),
            sprintpublicurl: req.param('sprintpublicurl'),
            sprintdeleted: 0,
            project: projectid
        }).exec(function createdSprint(err, sprint) {
            if(err) return next(err);
            Sprints.update({ 
                id: sprint.id
            }, 
            { 
                sprintpublicurl: sprint.sprintpublicurl + sprint.id
            }).exec(function updatedSprint(err, sprint) {
                if(err) return next(err);
                res.json(sprint);
            });
        });
    }
    
};

