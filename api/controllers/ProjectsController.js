/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    
    // index: function(req, res) {
    //    res.view({ title: '' });
    // },
    
    getProjects: function(req, res, next) {
        Projects.find().sort({ 'createdAt': -1 }).exec(function foundProjects(err, projects){
            if(err) return next(err);
            if(!projects) return next(err);
            res.json(projects);
        });
    },
    
    getProjectById: function(id, next) {
        Projects.findOne( { 'id': id } ).exec(function foundProject(err, project){
            if(err) return next.error(err);
            if(!project) return next.notFound('Could not find record');
            return next.success(project);
        });   
    },
    
    index: function(req, res, next) {
        Projects.find().sort({ 'createdAt': -1 }).exec(function foundProjects(err, projects){
            if(err) return next(err);
            if(!projects) return next(err);
            var arrScripts = [ "projects-data.js" ];
            res.view({ 
                title: "Project List", 
                scripts: arrScripts, 
                projects: projects
            });
        });
    },
   
   create: function(req, res, next) {
       Projects.create(req.params.all(), function createdProject(err, projects) {
           if(err) return next(err);
           res.json(projects);
       });
   },
   
   update: function(req, res, next) {
        if(typeof req.param('id') !== 'undefined' && typeof req.param('name') !== 'undefined') {
            Projects.update({ 'id' : req.param('id')}, req.params.all()).exec( function updatedProject(err, project) {
                if(err) return next(err);
                if(!project) return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' } );
                res.json(project);
            });
        } else {
            return res.badRequest('One or more expected parameters were missing in the requested resource',  { view: 'responses/badrequest', layout: 'responses/layout' } );
        }
   }
    
};

