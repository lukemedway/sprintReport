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
    
    getStoryCountBySprint: function(sprintid, next) {
        Story.count({ id: sprintid }).exec(function foundStories(err, stories) {
            if(err) return next.error(err);
            return next.success(stories);
        });
    },

    getStoriesBySprint: function(sprintid, next) {
        Story.find({ sprintparents: sprintid }).exec(function foundStories(err, stories) {
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
            var arrSprintParents = [];

            async.series([
                function(cb) {
                    for(i=0; i<arrData.length;i++) {
                        arrSprintParents.push(arrData[i].sprintparents);
                    }
                    cb(null, arrSprintParents);
                }
            ],
                function(err, results) {
                    if(err) return next(err);

                    // console.log("story: " + stories[0].storyjiraref)

                    stories.forEach(function(storyItem) {
                        // console.log(storyItem.storyjiraref);
                        Story.findOne( { storyjiraref: storyItem.storyjiraref } )
                        .exec(function(err, storyData) {
                            storyData.sprintparents.add(results[0][i]);
                            storyData.save(function(err, saved) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(saved);
                                }
                            });                        
                        });  
                    })

                    // stories.forEach(function(data, i) {
                    //     console.log("jiraref: " + data.storyjiraref);
                    //     Story.findOne({ storyjiraref: data.storyjiraref })
                    //     .then(function(aStory) {
                    //         aStory.sprintparents.add(results[0][i]);
                    //         aStory.save(function(err, saved) {
                    //             if (err) {
                    //                 // console.log(err);
                    //             } else {
                    //                 // console.log(saved);
                    //             }
                    //         });
                    //     });
                    // });
                    return next(stories);
                }
            );
            
        });
    }

    
    
};

