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
        Story.count({ id: sprintid })
        .exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },

    getStoriesBySprint: function(sprintid, next) {
        // Story.find().populate("sprintparents", { where: { sprintparents: sprintid } }).exec(function foundStories(err, stories) {
        Story.find({ sprintparents: sprintid })
        .where({ storyiscommitment: true, storydeleted: false })
        .populate("sprintparents")
        .exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },


    getDoneStoriesBySprint: function(sprintid, next) {
        Story.find({ sprintparents: sprintid })
        .where({ storycomplete: true, storydeleted: false })
        .populate("sprintparents")
        .exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },
    
    

    assignstories: function(arrFind, arrData, sprintid, next) {

        // Find existing stories or create new ones
        // Return back the full list and loop through each story to update it's association
        // If the story is being updated as a completed story, apply the completed value

        console.dir(arrFind);

        Story.findOrCreate(arrFind, arrData)
        .then(function(storiesData) {

            storiesData.forEach(function(story, i) {
                Story.findOne({ storyjiraref: story.storyjiraref })
                .populate("sprintparents")
                .then(function(story) {
                    if(typeof arrData[0].storycomplete == 'boolean') {
                        story.storycomplete = arrData[0].storycomplete;
                    }
                    console.log("storycomplete: " + i, arrData[0].storycomplete);
                    
                    story.sprintparents.add(sprintid);
                    story.save();
                    
                    if(storiesData.length == i+1) {
                        return next.success(storiesData);
                    }
                    
                })
                .catch(function(err) {
                    if(err) return next.error(err);
                });
            });

            
        })
        .catch(function(err) {
            if(err) return next.error(err);
        });
    },

    unassignstories: function(arrFind, arrData, sprintid, next) {

        // Find each story that we need to unassign from sprint
        // loop through each of the stories and then unassign each from the selected sprint

        arrData.forEach(function(story, i) {

            Story.findOne({ storyjiraref: story.storyjiraref })
            .populate('sprintparents')
            .then(function(storyData) {
                storyData.sprintparents.remove(sprintid);
                storyData.save();
            })
            .catch(function(err) {
                if(err) return next.error(err);
            });

        });

    },


    // NOT FINISHED

    delete: function(req, res, next) {
        
        // Find individual story and then mark as deleted

        Story.update({ storyjiraref: req.param('storyjiraref'), storydeleted: true })
        .then(function(story) {
            
        })
        .catch(function(err) {
            return next(err);
        });
    },

    deletestories: function(req, res, next) {

        // Iterate thorugh a list of stories and mark as deleted

        var arrStories = request.param('storyjiraref');

        arrStories.forEach(function(story, i) {
            Story.findOne({ storyjiraref: story.storyjiraref  })
            .then(function(storyData) {
                Story.update({ storyjiraref: story.storyjiraref, storydeleted: true })
                .then(function(storyUpdated) {
                    console.log("index: " + i);
                });
                return next(storyData);
            })
        })

    }

};


module.exports = StoriesController;
