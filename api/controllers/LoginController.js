/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    index: function(req, res) {
        // Set a different layout as this does not use the main dashboard template
        res.view({ layout: "login/layout" });
    },
    
    login: function(req, res, next) {
        
        res.send("");
        
    }
};

