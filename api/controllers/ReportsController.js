/**
 * ReportsController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


// Reports Controller holds information about the current status of the project
// Updates main project progress data including: Approximate Complete (%), 

module.exports = {
	
    // *******************************************************************
    
    // VIEW METHODS
    
    // *******************************************************************   
    
    
    index: function(req, res) {
        res.view();
    },
    
    client: function(req, res, next) {
        
    },
    
    report: function(req, res, next) {
        res.view({ title: 'OASIS REPORTS' });
    }
    
    
    // *******************************************************************
    
    // CRUD METHODS
    
    // *******************************************************************  







    // *******************************************************************
    
    // DATA METHODS
    
    // *******************************************************************    

    
};

