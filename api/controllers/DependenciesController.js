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
        }).then(function(dependencyData) {
            
            // Get the story assignments
            var arrStories = req.param('dependencystories');
            arrStories = arrStories.split(', ');
            
            if(typeof arrStories == 'object') {

                // Assign stories to created dependency
                dependencyData.stories.add(arrStories);
                
                // Commit changes and output data
                dependencyData.save(function(err){
                    if(err) return res.json(err);
                    return res.json(dependencyData);
                });
            } else {
                return res.json(dependencyData);
            }
            
        })
        .catch(function(err) {
            console.log(err);
        });
    },
    
    
    update: function(req, res, next) {
        
        Dependency.findOne({ id: req.param('dependencyid') } )
        .populate('stories', { select: ['storyjiraref'] } )
        .then(function(dependencyData) {

            // Get current assigned Stories
            var arrStoryIDs = dependencyData.stories;
            var currentStoryIDs = [];
            
            arrStoryIDs.forEach(function(story, i) {
                currentStoryIDs.push(story.storyjiraref);                
            });

            // Get new stories
            var newStoryIDs = req.param('dependencystories');
            newStoryIDs = newStoryIDs.split(', ');
                        
            // Remove old stories
            currentStoryIDs.forEach(function(storyid, i) {
                dependencyData.stories.remove(storyid);
            });

            // Persist Changes then add the new stories
            dependencyData.save(function(err) {
                
                if(typeof newStoryIDs == 'object') {
                    // Assign stories to created dependency
                    dependencyData.stories.add(newStoryIDs);
                }

                dependencyData.save(function(err) {
                    Dependency.update(
                    { id: req.param('dependencyid') },
                    {
                        dependencypriority: req.param('dependencypriority'),
                        dependencydesc:     req.param('dependencydesc'),
                        dependencyassignee: req.param('dependencyassignee'),
                        dependencystatus:   req.param('dependencystatus')
                    })
                    .then(function(updatedDependencyData){
                        return res.json(updatedDependencyData);
                    })
                    .catch(function(err) {
                        res.send(500, err);
                    })
                });
            })

        })
        .catch(function(err) {
            console.log(err);
            res.send(500, err);
        })
        
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

    // This needs a re-write - it's disgusting but sails doesn't allow DB sub queries.
    // Consider grabbing data from the DB and then filtering via array maniupulation.
    // Copied some code below that will flatten an object of arrays. (commented out)
    getDependenciesBySprintJson: function(req, res, next) {

        
        Sprint.find( { select: ['id', 'sprintname'] } )
        .where( { id: req.param('sprintid') } )
        .populate('stories', { select: ['storyjiraref'] } )
        .then(function(sprintData) {
            
            // console.log(sprintData);

            var arrSprintStories = sprintData[0].stories;
            var arrStoryIDs = [];
            
            // console.log(arrSprintStories)

            arrSprintStories.forEach(function(story, i) {

                arrStoryIDs.push(story.storyjiraref);


                if(arrSprintStories.length == i+1) {

                    // console.log(arrStoryIDs)

                    Story.find({ select: ['storyjiraref'], where: { storyjiraref: arrStoryIDs } } )
                    .populate('dependencies', { select: ['id'] } )
                    .then(function(storyDependencyData) {

                        // console.log(storyDependencyData)

                        var arrDependencyIDs = [];
                        var blnContinue = false;

                        storyDependencyData.forEach(function(storyDependency, i) {
                            
                            if(storyDependency.dependencies.length > 0) {

                                var arrDependencies = storyDependency.dependencies;

                                if(typeof arrDependencies != 'undefined') {
                                    // console.log("INSTANCEOF:", arrDependencies instanceof Array);
                                    if(arrDependencies instanceof Array) {
                                        arrDependencies.forEach(function(dependency, ii) {
                                            arrDependencyIDs.push(dependency.id);
                                            // console.log("Depdendency ID: ", dependency.id);                                
                                        });
                                    } else {
                                        // console.log(arrDependencies.id)
                                        arrDependencyIDs.push(arrDependencies.id);
                                    }
                                }
                            }

                            if(storyDependencyData.length == i+1) {


                                // console.log(arrDependencyIDs.length);

                                var query = {};
                                var queryNot = {};

                                // Priority, Status, Not In
                                var p = req.param('p');
                                var s = req.param('s');
                                var n = req.param('n');
                               
                                var arrPriorities = [];
                                var arrStatus = [];
                                var arrNot = [];
                               
                                if(typeof p != 'undefined') {
                                    arrPriorities = p.split(',');
                                    query['dependencypriority'] = arrPriorities;
                                }

                                if(typeof s != 'undefined') {
                                    arrStatus = s.split(',');
                                    query['dependencystatus'] = arrStatus;
                                }

                                if(typeof n != 'undefined') {
                                    arrNot = n.split(',');
                                    var q = {};
                                    q = { '!': arrNot };
                                    queryNot['dependencystatus'] = q;
                                }

                                // console.dir(query);
                                // console.log(queryNot);
                                // console.log("dependencyids:", arrDependencyIDs)

                                if(arrDependencyIDs.length == 0) {
                                    arrDependencyIDs = 0;
                                }

                                Dependency.find({ id: arrDependencyIDs })
                                .populate('stories', { select: ['storyjiraref', 'storydesc'] } )
                                .where( query )
                                .where( queryNot )
                                // .where( { dependencystatus: { '!': ['In Progress', 'Open'] } } )
                                .then(function(dependencyData) {
                                    res.json(dependencyData);
                                })
                                .catch(function(err) {
                                    res.json(err);
                                });
                    
                            }
                        })
                    })   
                }
            })
            
        })
        .catch(function(err) {
            console.log(err);
        })
        
        
    },


};

module.exports = DependenciesController;

