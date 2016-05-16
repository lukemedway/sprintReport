/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    index: function(req, res) {
        
        res.view('clients/index');
        
    }
    
};

