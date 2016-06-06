/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   
    
    index: function(req, res, next) {
        var arrScripts = [ "projects-data.js" ];
        res.view({ 
            title: "Project List", 
            scripts: arrScripts
        });
    },
    
    
    // *******************************************************************
    
    // CRUD METHODS
    
    // *******************************************************************   
    
    
    create: function(req, res, next) {
        Projects.create(req.params.all(), function createdProject(err, projects) {
            if(err) return next(err);
            res.json(projects);
        });
    },

    update: function(req, res, next) {
        if(typeof req.param('id') !== 'undefined' && typeof req.param('name') !== 'undefined') {
            Projects.update({ 'id': req.param('id')}, req.params.all()).exec(function updatedProject(err, project) {
                if(err) return next(err);
                if(!project) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' } );
                res.json(project);
            });
        } else {
            return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' } );
        }
    }, 

    delete: function(req, res, next) {
        Projects.update({ 'id': req.param('id')}, { 'deleted': true }).exec(function deletedProject(err, project) {
            if(err) return next(err);
            if(!project) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' });
            res.send(200);
        });
    }, 
    
    
    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************       
    
    
    getProjects: function(req, res, next) {
        Projects.find()
        .sort({ 'createdAt': -1 })
        .where({ 'deleted': false })
        .exec(function foundProjects(err, projects){
            if(err) return next(err);
            if(!projects) return next(err);
            res.json(projects);
        });
    },
    
    getProjectById: function(id, next) {
        Projects.findOne({ 'id': id }).exec(function foundProject(err, project) {
            if(err) return next.error(err);
            if(!project) return next.notFound('Could not find record');
            return next.success(project);
        });   
    },
    
    getProjectSprintsByProjectId: function(id, next) {
        Projects.findOne({ 'id': id }).populate('sprints').exec(function foundProjectSprints(err, projectsprints) {
           if(err) return next(err);
           if(!projectsprints) return next(err);
           return next(projectsprints); 
        });
    }
  
    
};

