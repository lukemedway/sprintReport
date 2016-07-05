/**
 * StoriesController
 *
 * @description :: Server-side logic for managing stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
var async = require('async');

StoriesController = {

    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   


    index: function(req, res, next) {
        
        res.view('stories/index');
    },
    
    // *******************************************************************
    
    // JSON VIEW METHODS
    
    // *******************************************************************     
    
    getstoriesbysprintid: function(req, res, next) {
        StoriesController.getStoriesBySprint(req.param('sprintid'), {
            success: function(stories) {
                console.log(req.param('sprintid'));
                res.json(stories);
            },
            error: function(err) {
                res.badRequest(err);
            }
        });
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
    
    getStoryCountBySprint: function(sprintid, next) {
        Story.count({ id: sprintid }).exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },

    getStoriesBySprint: function(sprintid, next) {
        // Story.find().populate("sprintparents", { where: { sprintparents: sprintid } }).exec(function foundStories(err, stories) {
        Story.find({ sprintparents: sprintid }).populate("sprintparents").exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },
    

    

    assignstories: function(arrFind, arrData, sprintid, next) {

        Story.findOrCreate(arrFind, arrData)
        .then(function(storiesData) {

            storiesData.forEach(function(story, i) {
                Story.findOne({ storyjiraref: story.storyjiraref })
                .populate("sprintparents")
                .then(function(story) {
                    story.sprintparents.add(sprintid);
                    story.save();
                })
                .catch(function(err) {
                    if(err) return next.error(err);
                });
            });

            return next.success(storiesData);
        })
        .catch(function(err) {
            if(err) return next.error(err);
        });
    }

};


module.exports = StoriesController;
