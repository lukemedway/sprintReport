/**
 * SprintsController
 *
 * @description :: Server-side logic for managing sprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Projects = require('./ProjectsController');

var SprintsController = {
	
    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   
    
    index: function(req, res, next) {
        Projects.getProjectById(req.param('id'), {
            success: function(projectData) {
                SprintsController.getLastXSprintsByProject(req.param('id'), 5, {
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
        Sprints.find({ id: req.param('id') }).populate('project').exec(function foundSprint(err, sprintData) {
            if(err) return next(err);
            if(!sprintData) return next(err);
            var arrScripts = ['sprintreport.js'];
            res.view({
                titie: "SPRINT REPORT",
                scripts: arrScripts,
                sprintData: sprintData
            });
        });        
    },
    
    
    reportjson: function(req, res, next) {
        Sprints.find({ id: req.param('id') }).populate('project').exec(function foundSprint(err, sprintData) {
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
        Sprints.create({ 
            sprintname: req.param('sprintname'),
            sprintpublicurl: req.param('sprintpublicurl'),
            sprintdeleted: false,
            project: projectid
        }).exec(function createdSprint(err, sprint) {
            if(err) return next(err);
            Sprints.update({ 
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
        Sprints.update({ 'id': req.param('sprintid') }, { sprintname: req.param('sprintname') }).exec(function updatedSprint(err, sprint) {
            if(err) return next(err);
            if(!sprint) return next(err);
            res.json(sprint);
        });
    },
    
    delete: function(req, res, next) {
        Sprints.update( { 'id': req.param('id') }, { 'sprintdeleted': true }).exec(function deletedSprint(err, sprint) {
            if(err) return next(err);
            if(!sprint) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' });
            res.json(sprint);
        });
    }, 
    
    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************      
    
    getSprints: function(req, res, next) {
        Sprints.find({ project: req.param('id') })
        .sort({ 'createdAt': -1 })
        .where({ 'sprintdeleted': false })
        .exec(function foundSprints(err, sprints) {
            if(err) return next(err);
            if(!sprints) return next(err);
            res.json(sprints);
        });       
    },
    
    getLastXSprintsByProject: function(projectid, x, next) {
        Sprints.find( { project: projectid } )
        .sort({ 'createdAt': -1 })
        .where({ 'sprintdeleted': false })
        .limit(x)
        .exec(function foundLastXSprintsByProject(err, sprints) {
            if(err) return next.error(err);
            return next.success(sprints);
        });
    }
        
};

module.exports = SprintsController;