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
            
            // Get the story assignments
            var arrStories = req.param('dependencystories');
            arrStories = arrStories.split(',');
            
            console.dir(arrStories.length);
            
            if(typeof arrStories == 'object') {
                arrStories.forEach(function(storyid, i) {
                    // Find the relevant story
                    Story.findOne({ storyjiraref: storyid.trim() })
                    .populate('dependencies')
                    .exec(function(err, storyData) {
                        // Ignore any stories which are not real
                        if(err) console.log('Could not locate story ref:', storyid);
                        if(!storyData) console.log('Could not locate story ref:', storyid);
                        
                        // If story exists, assign it to dependency
                        if(storyData) {
                            storyData.dependencies.add(dependencyData.id);
                            storyData.save();
                        }
                        
                        if(arrStories.length == i+1) return res.json(dependencyData);
                        
                    })
                });
            } else {
                return res.json(dependencyData);
            }
            
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
            if(typeof projectStories == 'object') {
                if(projectStories.length > 0) {
                    projectStories.forEach(function(story, i) {
                        storyData.push({ value: story.storyjiraref });
                        if(projectStories.length == i+1) {
                            res.json(storyData);
                        }
                    });
                } else {
                    res.send(200);
                }
            } else {
                // console.log('No Stories Found.');
                res.send(200);
            }
        })
        .catch(function(err) {
            res.json(err);
        });
        
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
        .populate('stories')
        .sort({ createdAt:-1 })
        .where({ dependencydeleted: false })
        .exec(function foundDependencies(err, dependenciesData) {
            if(err) return next(err);
            res.json(dependenciesData);
        })
    },


    getDependenciesBySprintJson: function(req, res, next) {
       
        
        // const json = JSON.stringify([
        // [{ prop: [1, 2, 3] }, { prop: [4, 5, 6] }, { prop: [7, 8, 9] }],
        // [{ prop: [1, 2, 3] }, { prop: [4, 5, 6] }, { prop: [7, 8, 9] }]
        // ])

        // const array = JSON.parse(json)


        // const manipulatedObject = _.chain(array)
        // .flatten()
        // .map(obj => obj.prop)
        // .flatten()
        // .value()

        // console.info(manipulatedObject)
        
        
        
        // Return all dependencies associated to stories that are associated with a sprint.
        
        // 1. Get all stories 
        // 2. Get all dependencies where dependencies in stories array
        
        
        Sprint.find( { id: req.param('sprintid') } )
        .populate('stories')
        .then(function(sprintData) {
            
            console.log(req.param('sprintid'));
            
            var arrSprintStories = sprintData[0].stories;
            var arrStoryIDs = [];
            
            arrSprintStories.forEach(function(story, i) {
                // console.log(story.storyjiraref);
                arrStoryIDs.push(story.storyjiraref);
                                
                if(arrSprintStories.length == i+1) {
                    console.log(arrStoryIDs);
                    
                    Dependency.find()
                    .populate('stories', { where: { storyjiraref: arrStoryIDs } } )
                    // .where( { sprint: req.param('sprintid') } )
                    .then(function(storyDependencyData) {
                        res.json(storyDependencyData);
                    })
                    
                }

            })
            
            
        })
        .catch(function(err) {
            res.send(err);
        })
        
        
    }

};

module.exports = DependenciesController;

