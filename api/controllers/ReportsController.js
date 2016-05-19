/**
 * ReportsController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    index: function(req, res) {
        res.view();
    },
    
    client: function(req, res, next) {
        if(req.param('id') != undefined) {
            res.view({ title: 'OASIS' });
        } else {
            res.redirect('/index');
            console.log('redirected to reports index because there was no ID');
        }
    },
    
    report: function(req, res, next) {
        res.view({ title: 'OASIS REPORTS' });
    }
    
};

