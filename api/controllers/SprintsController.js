/**
 * SprintsController
 *
 * @description :: Server-side logic for managing sprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Project = require('./ProjectsController');

var SprintsController = {
	
    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   
    
    index: function(req, res, next) {
        Project.getProjectById(req.param('id'), {
            success: function(projectData) {
                SprintsController.getLastXSprintsByProject(req.param('id'), 5, false, {
                    success: function(sprintData) {
                        var arrScripts = ['sprints-data.js'];
                        res.view({
                            title: "SPRINTS",
                            scripts: arrScripts,
                            projectData: projectData,
                            sprintData: sprintData
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
        Sprint.find({ id: req.param('id') }).populate('project').exec(function foundSprint(err, reportData) {
            if(err) return next(err);
            if(!reportData) return next(err);
            if(reportData.length == 0) return next(err);
            SprintsController.getLastXSprintsByProject(reportData[0].project.id, 5, false, {
                success: function(sprintData) {
                    var strView = '';
                    if(reportData[0].sprintissetup == false) { strView = 'sprints/setup'; }
                    console.dir(strView);
                    var arrScripts = ['sprintreport.js'];
                    res.view(strView, {
                        title: "SPRINT REPORT",
                        scripts: arrScripts,
                        sprintData: sprintData,
                        reportData: reportData
                    });
                },
                error: function(err){
                    console.log(err);
                    res.send(500, err);
                }
            });
        });        
    },

    edit: function(req, res, next) {
        res.view({ title: 'EDIT SPRINT DATA' });
    },
        
    reportjson: function(req, res, next) {
        Sprint.find({ id: req.param('id') }).populate('project').exec(function foundSprint(err, sprintData) {
            if(err) return next(err);
            if(!sprintData) return next(err);
            res.json(sprintData);
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
            .exec(function updatedSprint(err, sprint) {
                if(err) return next(err);
                res.json(sprint);
            });
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
        Sprint.update( { 'id': req.param('id') }, { 'sprintdeleted': true }).exec(function deletedSprint(err, sprint) {
            if(err) return next(err);
            if(!sprint) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' });
            res.json(sprint);
        });
    }, 
    
    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************      
    
    getSprints: function(req, res, next) {
        Sprint.find({ project: req.param('id') })
        .sort({ 'createdAt': -1 })
        .where({ 'sprintdeleted': false })
        .exec(function foundSprints(err, sprints) {
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        });       
    },
    
    getLastXSprintsByProject: function(projectid, x, all, next) {
        if (all) {
            Sprint.find( { project: projectid } )
            .sort({ 'createdAt': -1 })
            .where({ 'sprintdeleted': false })
            .limit(x)
            .exec(function foundLastXSprintsByProject(err, sprints) {
                if(err) return next.error(err);
                if (!sprints) return next.error(err)
                return next.success(sprints);
            });
        } else {
            Sprint.find( { project: projectid }, { select: ['id', 'sprintname'] } )
            .sort({ 'createdAt': -1 })
            .where({ 'sprintdeleted': false })
            .limit(x)
            .exec(function foundLastXSprintsByProject(err, sprints) {
                if(err) return next.error(err);
                if(!sprints) return next.notFound(err);
                return next.success(sprints);
            });
        }
    }
        
};

module.exports = SprintsController;