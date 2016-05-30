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
    
    getProjectById: function(id, cb) {
        console.log("id passed in: " + id);
        Projects.findOne( { 'id': id } ).exec(function foundProject(err, project){
        // Projects.findOne( { 'name': 'OASIS' } ).exec(function foundProject(err, project){
            if(err) return cb.error(err);
            if(!project) return cb.notFound('Could not find record');
            return cb.success(project);
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
        if(req.param('id') !== '' && req.param('name') !== '') {
            Projects.update({ 'id' : req.param('id')}, req.params.all()).exec( function updatedProject(err, projects) {
                if(err) return next(err);
                res.json(projects);
            });
        } else {
            return false;
        }
   }
    
};

