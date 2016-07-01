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
        // Story.find().populate("sprintparents", { where: { sprintparents: sprintid } }).exec(function foundStories(err, stories) {
        Story.find({ sprintparents: sprintid }).populate("sprintparents").exec(function foundStories(err, stories) {
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
                function(err, sprintparentids) {
                    if(err) return next(err);

                    // console.log("story: " + stories[0].storyjiraref)
                    // console.log("No of stories: " + stories.length);

                    var count = 0;

                    async.whilst(
                        function() { return count < stories.length; },
                        function(next) {
                            Story.findOne( { storyjiraref: stories[count].storyjiraref } )
                            .where( { "sprintparents" : { '!' : sprintparentids[0][count] } } )
                            .exec(function(err, storyData) {
                                if(err) {
                                    count++;
                                    next(err, count);
                                } else {
                                    if(!storyData) { count++; next(null, count); }
                                    storyData.sprintparents.add(sprintparentids[0][count]);
                                    storyData.save(function(err) {
                                        if(err) {
                                            console.log("error " + err);
                                            count++;               
                                            next(err, count);
                                        } else {
                                            console.log(storyData);
                                            count++;                  
                                            next(null, count);
                                        }
                                    });
                                }
                            });
                        },
                        function (err, n) {
                            // 5 seconds have passed, n = 5
                            console.log(n + " records were updated");
                        }
                    );

                    return next(stories);
                }
            );
            
        });
    }

    
    
};

