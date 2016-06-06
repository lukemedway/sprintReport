/**
 * StoriesController
 *
 * @description :: Server-side logic for managing stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    index: function(req, res, next) {
        
        res.view('stories/index');
        
    }
    
    
};

