/**
 * DependenciesController
 *
 * @description :: Server-side logic for managing dependancies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Project = require('./ProjectsController');
var Sprint = require('./SprintsController');

var DependenciesController = {

    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   

    index: function(req, res, next) {
        Project.getProjectByRef(req.param('id'), {
            success: function(projectData) {
                Sprint.getLastXSprintsByProjectRef(req.param('id'), 5, false, {
                    success: function(sprintData) {
                        var arrScripts = [ "dependencies.js" ];
                        res.view({
                            title: projectData.name + ' DEPENDENCIES',
                            scripts: arrScripts,
                            sprintData: sprintData
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
            
            // BELOW NEEDS REWRITE - INCREMENTAL COUNTER SHOULD BE IMPLEMENTED AS PART OF MODEL.
            // AUTO-INCREMENT FIELDS ARE NOT SUPPORTED BY SAILS / MONGODB - CHEERS! :thumbsup:
            


            // DependenciesController.getLastInsertedCollectionByProject(res, dependencyData.project, function(lastDependencyData) {     
            //     var dependencyref = lastDependencyData[0].dependencyref + 1;

            //     Dependency.update({
            //         id: dependencyData.id
            //     },
            //     {
            //         dependencyref: dependencyref
            //     })
            //     .exec(function updatedDependency(err, dependencyDataUpdated) {
            //         if(err) next(err);
            //         res.json(dependencyDataUpdated);
            //     })  
            // });
             
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

