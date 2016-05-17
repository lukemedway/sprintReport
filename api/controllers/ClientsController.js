/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */














module.exports = {
	
    index: function(req, res) {
       res.view({ title: 'CLIENTS' });
    },
    
    client: function(req, res, next) {
        if( req.param('id') != undefined ) {
            res.view({ title: 'OASIS' });
        } else {
            res.redirect('/clients');
            console.log('redirected to clients because there was no ID');
        }
    }
    
};

