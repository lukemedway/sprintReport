/**
 * DependenciesController
 *
 * @description :: Server-side logic for managing dependancies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ProjectsController = require('./ProjectsController');
var SprintsController = require('./SprintsController');

var DependenciesController = {

    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   

    index: function(req, res, next) {
        ProjectsController.getProjectByRef(req.param('id'), {
            success: function(projectData) {
                SprintsController.getLastXSprintsByProjectRef(req.param('id'), 5, false, {
                    success: function(sprintData) {
                        var arrScripts = [ "dependencies.js" ];
                        res.view({
                            title: projectData.name + ' DEPENDENCIES',
                            scripts: arrScripts,
                            sprintData: sprintData,
                            dependencyMenuActive: true
                        });
                    },
                    error: function(err) {
                        console.log('Error with retrieving sprints ' + err);
                        res.send(304, err);
                    }
                });
            },
            error: function(err) {
                console.log('Error with the Project.getProjectByRef Method: ' + err);
                res.send(304, err);
            },
            notFound: function(err) {
                res.badRequest('A project does not exist with the provided indentifier');
            }
        });
    },

    edit: function(req, res, next ) {
        res.view();
    },
    





    // *******************************************************************
    
    // CRUD METHODS
    
    // *******************************************************************
    
    create: function(req, res, next) {
        Dependency.create({ 
            dependencyref: 0,
            dependencypriority: req.param('dependencypriority'),
            dependencydesc: req.param('dependencydesc'),
            dependencyassignee: req.param('dependencyassignee'),
            dependencystatus: req.param('dependencystatus'),
            project: req.param('id')
        }).exec(function createdDependency(err, dependencyData) {
            if(err) return next(err);
            if(!dependencyData) return next(err);
            res.json(dependencyData);           
        });
    },
    

    // *******************************************************************
    
    // JSON DATA METHODS
    
    // *******************************************************************

    getStoriesByProject: function(req, res, next) {
        
        Story.find( { project: req.param('id') } )
        .where({ storydeleted: false })
        .then(function(projectStories) {

            var storyData = [];

            projectStories.forEach(function(story, i) {
                storyData.push({ value: story.storyjiraref });
                if(projectStories.length == i+1) {
                    res.json(storyData);
                }
            });

        })
        .catch(function(err) {
            res.json(err);
        })
        
        // Project.find( { jiraprojectref: req.param('id') } )
        // .populate('story', { where: { deleted: false } } )
        // .then(function(projectStories) {
        //     res.json(projectStories);
        // })
        // .catch(function(err) {
        //     res.json(err);
        // })
    },


    getStoriesBySprint: function(req, res, next) {
        Story.find( { project: req.param('id') } )
        .populate('project').
        then(function(stories) {
            res.json(stories);
        })
        .catch(function(err) {
            res.badRequest("Could not locate project stories");
        });
    },


    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************   

    getLastInsertedCollectionByProject: function(res, projectid, next) {
        Dependency.find({ project: projectid })
        .sort({ createdAt:-1 })
        .limit(2)
        .exec(function foundLastDependency(err, dependencyLastCollection) {
            if(err) return next(err);
            res.json(dependencyLastCollection);
            // return next(dependencyLastCollection);
        });
    },

    getDependenciesByProjectRefJson: function(req, res, next) {
        Dependency.find({ 'project': req.param('id') })
        .sort({ createdAt:-1 })
        .where({ dependencydeleted: false })
        .exec(function foundDependencies(err, dependenciesData) {
            if(err) return next(err);
            res.json(dependenciesData);
        })
    },


    getDependenciesBySprintJson: function(req, res, next) {
        Dependency.find( { id: req.param('id') } )
        .where( { dependecydeleted: false } )
        .exec(function foundDependenciesBySprint(err, dependencyData) {
            if(err) return next(err);
            res.json(dependencyData);
        });
    }

};

module.exports = DependenciesController;

