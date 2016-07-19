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
                    if(err) console.log(err);
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
            var arrStoryIDs = dependencyData.stories;
            var dpData = dependencyData;
            return [arrStoryIDs, dpData];
        })
        .catch(function(err) {
            console.log(err);
        })
        .then(function(arrStoryIDs, dependencyData){
            
            console.log(arrStoryIDs);
            
            // arrStoryIDs.forEach(function(story, i){
                
            // })
            
            // console.log(arrStoryIDs);
            // res.ok();
            
        })
        
        
        
        // Dependency.update(
        //     { id: req.param('dependencyid') },
        //     {
        //         dependencypriority: req.param('dependencypriority'),
        //         dependencydesc:     req.param('dependencydesc'),
        //         dependencyassignee: req.param('dependencyassignee'),
        //         dependencystatus:   req.param('dependencystatus')
        //     })
        //     .then(function(dependencyData){
                
        //         var dependencyAssociations = Dependency.findOne({ id: req.param('dependencyid') })
        //         .populate('stories')
        //         .then(function(associationData){
        //             console.log(associationData);
        //             return associationData.stories;
        //         });
        //         return dependencyAssociations;
        //     })
        //     .catch(function(err){
        //         console.log(err);
        //         res.badRequest('ERROR: Could not update this record.');
        //     })
        //     .then(function(dependencyAssociations) {
        //         console.log("Associations:", dependencyAssociations);
                
        //     })
        //     .catch(function(err){
        //         console.log(err);
        //         res.badRequest('ERROR: Could not update associations for this record.');
        //     })
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
        
        // 1. Get all stories by sprint
        // 2. Get all dependencies where dependencies in stories array
        
        
        Sprint.find( { select: ['id', 'sprintname'] } )
        .where( { id: req.param('sprintid') } )
        .populate('stories', { select: ['storyjiraref'] } )
        .then(function(sprintData) {
            
            // console.log(sprintData);

            var arrSprintStories = sprintData[0].stories;
            var arrStoryIDs = [];
            
            arrSprintStories.forEach(function(story, i) {

                arrStoryIDs.push(story.storyjiraref);

                if(arrSprintStories.length == i+1) {

                    Story.find({ select: ['storyjiraref'], where: { storyjiraref: arrStoryIDs } } )
                    .populate('dependencies', { select: ['id'] } )
                    .then(function(storyDependencyData) {

                        // console.log(storyDependencyData);

                        // var arrDependencies = storyDependencyData[0].dependencies[0];

                        var arrDependencyIDs = [];
                        var blnContinue = false;

                        storyDependencyData.forEach(function(storyDependency, i) {

                            var arrDependencies = storyDependency.dependencies;
                            
                            // console.log("DEPENDENCIES", arrDependencies);

                            if(typeof arrDependencies != 'undefined') {
                                // console.log(typeof arrDependencies);
                                if(arrDependencies instanceof Array) {
                                    arrDependencies.forEach(function(dependency, ii) {
                                        arrDependencyIDs.push(dependency.id);  
                                        // console.log("Depdendency ID: ", dependency.id);                                
                                    });
                                } else {
                                    arrDependencyIDs.push(arrDependencies.id);
                                }
                            }

                            if(storyDependencyData.length == i+1) {

                                // if(typeof req.param('dependencypriority') != 'undefined') {
                                //     // Now we have a list of all dependencies associated to sprint via stories, retrieve them from DB.
                                //     Dependency.find({ id: arrDependencyIDs })
                                //     .where({ dependencypriority: req.param('dependencypriority') })
                                //     .populate('stories', { select: ['storyjiraref'] } )
                                //     .then(function(dependencyData) {
                                //         res.json(dependencyData);
                                //     })
                                //     .catch(function(err) {
                                //         console.log(err);
                                //     });    
                                // } else if(typeof req.param('dependencystatus' != 'undefined')) {
                                //     // Now we have a list of all dependencies associated to sprint via stories, retrieve them from DB.
                                //     Dependency.find({ id: arrDependencyIDs })
                                //     .where({ dependencstatus: req.param('dependencystatus') })
                                //     .populate('stories', { select: ['storyjiraref'] } )
                                //     .then(function(dependencyData) {
                                //         res.json(dependencyData);
                                //     })
                                //     .catch(function(err) {
                                //         console.log(err);
                                //     });
                                // } else {



                                    // Now we have a list of all dependencies associated to sprint via stories, retrieve them from DB.
                                    // Dependency.find({ id: arrDependencyIDs })
                                    // .where( { dependencypriority: '' })
                                    // .populate('stories', { select: ['storyjiraref'] } )
                                    // .then(function(dependencyData) {
                                    //     res.json(dependencyData);
                                    // })
                                    // .catch(function(err) {
                                    //     console.log(err);
                                    // });

                                    Dependency.find( { id: arrDependencyIDs })
                                    .where( { dependencypriority: 'Critical' }, { dependencystatus: 'In Progress' } )
                                    // .where( { dependencystatus: 'In Progress' } )
                                    .populate('stories', { select: ['storyjiraref'] } )
                                    .then(function(dependencyData) {
                                        res.json(dependencyData);
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                    })

                                // }
                                
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

    getDependencyData: function(priority, status, next) {

        var blnFilter = false;
        var priority = req.param('dependencypriority');
        var status = req.param('dependencystatus');

        if(priority.length > 0) {
            blnFilter = true;

        }

        if(status.length > 0) {
            blnFilter = true;
        }

        if(blnFilter) {
            // Now we have a list of all dependencies associated to sprint via stories, retrieve them from DB.
            Dependency.find({ id: arrDependencyIDs })
            .populate('stories', { select: ['storyjiraref'] } )
            .then(function(dependencyData) {
                next(dependencyData);
            })
            .catch(function(err) {
                console.log(err);
            });
        } else {
            // Now we have a list of all dependencies associated to sprint via stories, retrieve them from DB.
            Dependency.find({ id: arrDependencyIDs })
            .populate('stories', { select: ['storyjiraref'] } )
            .then(function(dependencyData) {
                next(dependencyData);
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    }

};

module.exports = DependenciesController;

