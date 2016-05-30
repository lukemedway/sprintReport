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
        Sprints.find({ project: req.param("id") }).exec(function foundSprints(err, sprints) {
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        });       
    }
    
    // Hard Coded create function testing relationships
    // create: function(req, res, next) {
    //     Sprints.create({ 
    //         sprintname: 'Sprint 2',
    //         sprintpublicurl: 'http://test.com',
    //         sprintdeleted: 0,
    //         project: '574c75f1f1e3c6c0423c8427'
    //     }).exec( function createdSprint(err, sprints) {
    //         if(err) return next(err);
    //         res.json(sprints);
    //     });
    // }
    
};

