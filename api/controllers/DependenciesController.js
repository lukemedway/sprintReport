/**
 * DependenciesController
 *
 * @description :: Server-side logic for managing dependancies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var DependenciesController = {

    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   

    index: function(req, res, next) {
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
            project: req.param('project')
        }).exec(function createdDependency(err, dependencyData) {
            if(err) return next(err);
            if(!dependencyData) return next(err);
            
            // BELOW NEEDS REWRITE - INCREMENTAL COUNTER SHOULD BE IMPLEMENTED AS PART OF MODEL.

            DependenciesController.getLastInsertedCollectionByProject(res, dependencyData.project, function(lastDependencyData) {     
                var dependencyref = lastDependencyData[0].dependencyref + 1;

                Dependency.update({
                    id: dependencyData.id
                },
                {
                    dependencyref: dependencyref
                })
                .exec(function updatedDependency(err, dependencyDataUpdated) {
                    if(err) next(err);
                    res.json(dependencyDataUpdated);
                })  
            });
             
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

