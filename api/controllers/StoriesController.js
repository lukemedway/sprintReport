/**
 * StoriesController
 *
 * @description :: Server-side logic for managing stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var async = require('async');

module.exports = {

    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   


    index: function(req, res, next) {
        
        res.view('stories/index');
    },


    // *******************************************************************
    
    // CRUD METHODS
    
    // *******************************************************************   

    create: function(req, res, next) {
        // Story.create()
    },


    // *******************************************************************
    
    // DATA METHODS 
    
    // *******************************************************************       

    getStoriesByProjectRefJson: function(req, res, next) {
        Story.find({ project: req.param('id') })
        .where({ storydeleted: false })
        .exec(function foundStories(err, stories) {
            if(err) next(err);
            if(!stories) next(err);
            res.json(stories);
        });
    },
    
    getStoryCountBySprint: function(sprintId, next) {
        Story.count({ id: sprintId }).exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },
    
    findOrCreate: function(arrFind, arrData, next) {
        Story.findOrCreate(arrFind, arrData)
        .then(function(stories) {
            // If no stories are found 
            if(stories === undefined) { return next('Not found'); }
            
            // We have a list of stories
            // Need to update each story with the matching arrData (sprintparents)
            
            
            
            
            // Apply the relevant associations
            
            // 
            
            next(stories);
                
        });
    }

    
    
};

