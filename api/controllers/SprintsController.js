/**
 * SprintsController
 *
 * @description :: Server-side logic for managing sprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Project = require('./ProjectsController');
var StoriesController = require('./StoriesController');

var SprintsController = {
	
    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   
    
    index: function(req, res, next) {
        Project.getProjectByRef(req.param('id'), {
            success: function(projectData) {
                SprintsController.getLastXSprintsByProjectRef(req.param('id'), 5, false, {
                    success: function(sprintData) {

                        var scripts = ['sprints-data.js'];
                        
                        res.view({
                            title: projectData.name,
                            scripts: scripts,
                            projectData: projectData,
                            sprintData: sprintData,
                            sprintMenuActive: true
                        });
                    },
                    error: function(err){
                        console.log(err);
                        res.send(500, err);
                    }
                });
            },
            error: function(err) {
                console.log('ERROR with ProjectsController.getProjectByID: ' + err);
                res.send(500, err);
            },
            notFound: function(str) {
                console.log(str);
                res.send(404, str);
            }
        });
    },
    
    report: function(req, res, next) {
        Sprint.find({ id: req.param('sprintid') })
        .populate('project')
        .then(function(reportData) {
            
            if(reportData[0].sprintissetup == false) { return SprintsController.setupreport(req, res, next); }
            SprintsController.getLastXSprintsByProjectRef(reportData[0].project.jiraprojectref, 5, false, {
                success: function(menuData) {
                    
                    SprintsController.getSprintCountByProject(req, res, { 
                        success: function(count) {
                            // If viewing the first sprint, a commitment list will not exist
                            var blnShowCommitment = false;
                            (count == 1) ? blnShowCommitment = false : blnShowCommitment = true;
                            
                            
                                               
                            var scripts = ['sprintreport.js', 'chart.js'];
                            res.view('sprints/report', {
                                title: reportData[0].project.name + " REPORT",
                                scripts: scripts,
                                sprintData: menuData,
                                reportData: reportData,
                                sprintMenuActive: true,
                                showCommitment: blnShowCommitment
                            });
                        },
                        error: function(err) {
                            res.send(500, err);
                        }
                     });
               
                },
                error: function(err){
                    console.log(err);
                    res.send(500, err);
                }
            });
        })
        .catch(function(err) {
            return next(err);
        });        
    },
    
    setupreport: function(req, res, next) {
        Sprint.find({ id: req.param('sprintid') })
        .populate('project')
        .exec(function foundSprint(err, reportData) {
            if(err) return next(err);
            if(!reportData) return next(err);
            if(reportData.length == 0) return next(err);

            Sprint.find({ project: reportData[0].project.jiraprojectref })
            .populate('project')
            .sort({ 'createdAt': -1 })
            .where({ createdAt: { '<=': reportData[0].createdAt }, 'sprintdeleted': false })
            .exec(function foundSprints(err, sprints) {
                if(err) return next(err);
                if(!sprints) return next(err);
                Sprint.find({ project: reportData[0].project.jiraprojectref })
                .sort({ 'createdAt': -1 })
                .where({ sprintdeleted: false })
                .exec(function foundFullSprints(err, menuData){
                    var scripts = ['sprint-setup.js'];
                    res.view('sprints/setup', {
                        title: 'REPORT SETUP',
                        scripts: scripts,
                        reportData: reportData,
                        sprints: sprints,
                        sprintData: menuData,
                        sprintMenuActive: true
                    });
                });   
            }); 
        });
    },
    
    setupsprintstories: function(req, res, next) {       
        StoriesController.getStoryCountBySprint(req.param('sprintid'), {
            success: function(stories) {
                if(stories == 0) {
                    SprintsController.initialstorysetup(req, res, next);
                } else {
                    SprintsController.iterativestorysetup(req, res, next);
                }
            },
            error: function(err) {
                res.send(500, err);
            }
        });
    },
    
    initialstorysetup: function(req, res, next) {
        Sprint.find({ id: req.param('sprintid') })
        .populate('project')
        .exec(function foundSprint(err, reportData) {
            if(err) return next(err);
            if(!reportData) return next(err);
            if(reportData.length == 0) return next(err);

            Sprint.find({ project: reportData[0].project.jiraprojectref })
            .populate('project')
            .sort({ 'createdAt': -1 })
            .where({ createdAt: { '<=': reportData[0].createdAt }, 'sprintdeleted': false })
            .exec(function foundSprints(err, sprints) {
                if(err) return next(err);
                if(!sprints) return next(err);
                
                Sprint.find({ project: reportData[0].project.jiraprojectref })
                .sort({ 'createdAt': -1 })
                .where({ sprintdeleted: false })
                .exec(function foundFullSprints(err, menuData){
                    if(err) return next(err);
                    if(!menuData) return next();
                    
                    JiraService.getJIRASprints(reportData[0].project.projectjiraboard, {
                        success: function(jiraSprints) {
                            var scripts = ["sprint-stories.js"];
                            res.view('sprints/stories', {
                                title: 'SETUP ' + reportData[0].project.name + ' SPRINT STORIES',
                                scripts: scripts,
                                reportData: reportData,
                                sprints: sprints,
                                sprintData: menuData,
                                jiraSprints: jiraSprints,
                                sprintMenuActive: true
                            });
                        },
                        error: function(err) {
                            res.send(500, 'Could not contact JIRA, please check your connection or try again later.');
                        }
                    });
                });   
            }); 
        });
    },

    completestories: function(req, res, next) {
        Sprint.find({ id: req.param('sprintid') })
        .populate('project')
        .exec(function foundSprint(err, reportData) {
            if(err) return next(err);
            if(!reportData) return next(err);
            if(reportData.length == 0) return next(err);

            Sprint.find({ project: reportData[0].project.jiraprojectref })
            .populate('project')
            .sort({ 'createdAt': -1 })
            .where({ createdAt: { '<=': reportData[0].createdAt }, 'sprintdeleted': false })
            .exec(function foundSprints(err, sprints) {
                if(err) return next(err);
                if(!sprints) return next(err);
                
                Sprint.find({ project: reportData[0].project.jiraprojectref })
                .sort({ 'createdAt': -1 })
                .where({ sprintdeleted: false })
                .exec(function foundFullSprints(err, menuData){
                    if(err) return next(err);
                    if(!menuData) return next();
                    
                    JiraService.getJIRASprints(reportData[0].project.projectjiraboard, {
                        success: function(jiraSprints) {
                            var scripts = ["sprint-stories-complete.js"];
                            res.view('sprints/completestories', {
                                title: 'SETUP ' + reportData[0].project.name + ' SPRINT STORIES COMPLETED',
                                scripts: scripts,
                                reportData: reportData,
                                sprints: sprints,
                                sprintData: menuData,
                                jiraSprints: jiraSprints,
                                sprintMenuActive: true
                            });
                        },
                        error: function(err) {
                            res.send(500, 'Could not contact JIRA, please check your connection or try again later.');
                        }
                    });
                });   
            }); 
        });
    },

    
    iterativestorysetup: function(req, res, next) {
        res.send(200, "Hello World");
    },
    


    test: function(req, res, next) {
        // console.log();
        // res.send(200);
        // res.view("HALLO");
    },
        

    // *******************************************************************
    
    // JSON VIEW METHODS
    
    // *******************************************************************  


    getstoriesbysprintid: function(req, res, next) {
        Sprint.find( { id: req.param('sprintid') } )
        .populate('stories', { where: { storyiscommitment: true } } )
        .then(function(sprint) {
            res.json(sprint[0].stories);
        })
        .catch(function(err) {
            res.send(500, err);
        });
    },

    getdonestoriesbysprintid: function(req, res, next) {
        Sprint.find( { id: req.param('sprintid') } )
        .populate('stories', { where: { storycomplete: true } } )
        .then(function(sprint) {
            res.json(sprint[0].stories);
        })
        .catch(function(err) {
            res.send(500, err);
        });
    },


    // *******************************************************************
    
    // CRUD METHODS
    
    // *******************************************************************  
    
    create: function(req, res, next) {
        
        var projectid = req.param('projectid');
        Sprint.create({ 
            sprintname: req.param('sprintname'),
            sprintpublicurl: req.param('sprintpublicurl'),
            sprintdeleted: false,
            project: projectid
        }).exec(function createdSprint(err, sprint) {
            if(err) return next(err);
            Sprint.update({ 
                id: sprint.id
            }, 
            { 
                sprintpublicurl: sprint.sprintpublicurl + sprint.id
            })
            .exec(function updatedSprint(err, sprintData) {
                if(err) return next(err);
                res.json(sprintData);
            });
        });
    },

    setupcomplete: function(req, res, next) {
               
        // *********************************************  
        // Processing Date Object - Forcing Format. 
        // *********************************************   
           
        var datefrom, dateto
        datefrom = req.param('sprintdatefrom');
        dateto = req.param('sprintdateto');

        var partsfrom = datefrom.match(/(\d+)/g);
        datefrom = new Date(partsfrom[2], partsfrom[1]-1, partsfrom[0]);

        var partsto = dateto.match(/(\d+)/g);
        dateto = new Date(partsto[2], partsto[1]-1, partsto[0]);
        
        // *********************************************  
        // End Date Object Handling
        // *********************************************
        
        var sprintVelocities = req.param('sprintvelocityavg');
        var arrSV = sprintVelocities.split(',');
        if(arrSV.length > 1) {
            
            // Cast all string values to Number so we apply math logic
            for(i=0; i<arrSV.length; i++) { arrSV[i] = Number(arrSV[i]) };
            
            // Determine the average based on all sprints up to current sprint
            var sum = arrSV.reduce(function(total, num) { return total + num }, 0);
            var avg = sum / arrSV.length;
            avg = Number(avg).toFixed(1);
            
            // console.dir(avg);
        } else {
            // If there is only a single sprint in the project 
            // the average is velocity of this sprint.
            avg = Number(req.param('sprintvelocity'));
        }
                
        Sprint.update({ 'id': req.param('sprintid') }, {
            sprintname: req.param('sprintname'),
            sprintdatefrom: datefrom,
            sprintdateto: dateto,
            sprintpublicurl: req.param('sprintpublicurl'),
            sprintvelocity: req.param('sprintvelocity'),
            sprintvelocitytarget: req.param('sprintvelocitytarget'),
            sprintvelocityavg: avg,
            sprintcompletion: req.param('sprintcompletion'),
            sprintnotes: req.param('sprintnotes'),
            sprintissetup: req.param('sprintissetup')
        })
        .exec(function updatedSprintSetup(err, sprint) {
            if(err) return next(err);
            // Edit param value comes from the router options
            if(req.param("edit") == true) {
                res.redirect('/' + req.param('id') + '/sprints/report/' + req.param('sprintid'));
            } else {
                res.redirect('/' + req.param('id') + '/sprints/report/' + req.param('sprintid') + "/stories");
            }
        });

    },

    
    storycomplete: function(req, res, next) {
        
        var arrStoryJiraRefs = req.param('storyjiraref');
        var arrStoryPriorities = req.param('storypriority');
        var arrStoryPoints = req.param('storypoints');
        var arrStoryDesc = req.param('storydesc');
        var arrStoryStatus = req.param('storystatus');
        
        // DB object to pass into the create function
        var arrData = [];
        var arrFind = [];
        
        //  Check that all arrays have equal length
        (   arrStoryJiraRefs.length == arrStoryPriorities.length &&
            arrStoryJiraRefs.length == arrStoryDesc.length &&
            arrStoryJiraRefs.length == arrStoryStatus.length &&
            arrStoryJiraRefs.length == arrStoryPoints.length
        ) ? blnContinue = true : blnContinue = false;
        
        if(arrStoryJiraRefs.length > 0 && blnContinue) {
            for(i=0; i<arrStoryJiraRefs.length; i++) {
                arrData.push({ 
                    storyjiraref: arrStoryJiraRefs[i],
                    storydesc: arrStoryDesc[i],
                    storypriority: arrStoryPriorities[i],
                    storystatus: arrStoryStatus[i],
                    storypoints: arrStoryPoints[i],
                    storyiscommitment: true,
                    sprintparents: req.param('sprintid'),
                    project: req.param('id')
                });
                arrFind.push({ storyjiraref: arrStoryJiraRefs[i] });
            }

            if(arrData != 'undefined') {
                if(arrData.length > 0) {
                    StoriesController.assignstories(arrFind, arrData, req.param('sprintid'), {
                        success: function(stories) {
                            res.redirect('/' + req.param('id') + '/sprints/report/' + req.param('sprintid') + '/completestories');
                        },
                        error: function(err) {
                            res.send(500, err);
                        }
                    });
                }
            }
        } else {
            res.badRequest('Array length mismatch, please go back and retry.');
        }
    },

    storiesdonecomplete: function(req, res, next) {
              
        var arrStoryJiraRefs = req.param('storyjiraref');
        var arrStoryPriorities = req.param('storypriority');
        var arrStoryPoints = req.param('storypoints');
        var arrStoryDesc = req.param('storydesc');
        var arrStoryStatus = req.param('storystatus');       
        
        // DB object to pass into the create function
        var arrData = [];
        var arrFind = [];
        
        //  Check that all arrays have equal length
        (   arrStoryJiraRefs.length == arrStoryPriorities.length &&
            arrStoryJiraRefs.length == arrStoryDesc.length &&
            arrStoryJiraRefs.length == arrStoryStatus.length &&
            arrStoryJiraRefs.length == arrStoryPoints.length
        ) ? blnContinue = true : blnContinue = false;
        
        if(arrStoryJiraRefs.length > 0 && blnContinue) {
            for(i=0; i<arrStoryJiraRefs.length; i++) {
                arrData.push({ 
                    storyjiraref: arrStoryJiraRefs[i],
                    storydesc: arrStoryDesc[i],
                    storypriority: arrStoryPriorities[i],
                    storystatus: arrStoryStatus[i],
                    storypoints: arrStoryPoints[i],
                    storycomplete: true,
                    sprintparents: req.param('sprintid'),
                    project: req.param('id')
                });
                arrFind.push({ storyjiraref: arrStoryJiraRefs[i] });
            }

            if(arrData != 'undefined') {
                if(arrData.length > 0) {
                    StoriesController.assignstories(arrFind, arrData, req.param('sprintid'), {
                        success: function(stories) {
                            res.redirect('/' + req.param('id') + '/sprints/report/' + req.param('sprintid'));
                        },
                        error: function(err) {
                            res.send(500, err);
                        }
                    });
                }
            }
        } else {
            res.badRequest('Array length mismatch, please go back and retry.');
        }
    },



    sprintstories: function(req, res, next) {
        StoryController.getStoriesBySprint(req.param('sprintid'), {
            success: function(stories) {
                res.json(stories)
            },
            error: function(err) {
                return next(err);
            }
        });
    },

    
    update: function(req, res, next) {
        Sprint.update({ 'id': req.param('sprintid') }, { sprintname: req.param('sprintname') }).exec(function updatedSprint(err, sprint) {
            if(err) return next(err);
            if(!sprint) return next(err);
            res.json(sprint);
        });
    },
    
    delete: function(req, res, next) {
        Sprint.update({ 'id': req.param('sprintid') }, { 'sprintdeleted': true }).exec(function deletedSprint(err, sprint) {
            if(err) return next(err);
            if(!sprint) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' });
            res.json(sprint);
        });
    }, 

    
    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************      
           
    
    getJiraSprintsByName: function(req, res, next) {
        var sprintname = req.param('sprintname');
        var projectjiraref = req.param('id');
        JiraService.getJIRAStoriesByProjectKeySprintName(projectjiraref, sprintname, {
            success: function(jiraData) {
                res.json(jiraData);
            },
            error: function(err) {
                res.send(500, err);
            }
        });
    },
    
    getSprintCountByProject: function(req, res, next) {
        Sprint.count({ project: req.param('id') })
        .then(function(sprintno) {
            return next.success(sprintno);
        })
        .catch(function(err) {
            return next.error(err);
        })
    },

    getSprints: function(req, res, next) {
        Sprint.find({ project: req.param('id') })
        .populate('project')
        .sort({ 'createdAt': -1 })
        .where({ 'sprintdeleted': false })
        .exec(function foundSprints(err, sprints) {
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        });       
    },
    
    getLastXSprintsByProjectRef: function(jiraprojectref, x, all, next) {
        if(all) {
            Sprint.find({ project: jiraprojectref })
            .populate('project')
            .sort({ 'createdAt': -1 })
            .where({ 'sprintdeleted': false })
            .limit(x)
            .exec(function foundLastXSprintsByProject(err, sprints) {
                if(err) return next.error(err);
                if (!sprints) return next.error(err)
                return next.success(sprints);
            });
        } else {
            Sprint.find( { project: jiraprojectref }, { select: ['id', 'sprintname', 'sprintissetup'] } )
            .populate('project')
            .sort({ 'createdAt': -1 })
            .where({ 'sprintdeleted': false })
            .limit(x)
            .exec(function foundLastXSprintsByProject(err, sprints) {
                if(err) return next.error(err);
                if(!sprints) return next.notFound(err);
                return next.success(sprints);
            });
        }
    },

    getReportJson: function(req, res, next) {
        Sprint.find({ id: req.param('id') }).populate('project').exec(function foundSprint(err, sprintData) {
            if(err) return next(err);
            if(!sprintData) return next(err);
            res.json(sprintData);
        });        
    },
    
    getSprintsByProjectJson: function(req, res, next) {
        Sprint.find()
        .where( { project: req.param('id'), sprintdeleted: false } )
        .exec(function foundSprintsByProject(err, sprintsData) {
            if(err) return next(err);
            if(!sprintsData) return next(err)
            res.json(sprintsData);
        });
    },

    getSprintsBySprintJson: function(req, res, next) {
        Sprint.find({ id: req.param('sprintid') })
        .populate('project')
        .exec(function foundSprint(err, sprintData) {
            if(err) return next(err);
            if(!sprintData) return next(err);
            if(sprintData.length == 0) return next(err);
            Sprint.find({ createdAt: { '<=': sprintData[0].createdAt } })
            .where( { project: sprintData[0].project.jiraprojectref, sprintdeleted: false } )
            .exec(function foundSprintsByProject(err, sprints) {
               if(err) return next(err);
               if(!sprints) return next(err);
               res.json(sprints); 
            });
        });
    },

    getAllSprintsByProjectRefJson: function(projectref, next) {
        Sprint.find()
        .where({ jiraprojectref: projectref, sprintdeleted: false })
        .exec(function foundSprints(err, sprints){
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        })
    }
  
};

module.exports = SprintsController;