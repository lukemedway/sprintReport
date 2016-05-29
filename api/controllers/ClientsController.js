/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */














module.exports = {
	
    // index: function(req, res) {
    //    res.view({ title: 'CLIENTS' });
    // },
    
    
    list: function(req, res) {
        Clients.find().exec(function foundClients(err, clients){
            if(err) return next(err);
            if(!clients) return next();
            var arrScripts = [ "clients-data-table.js" ];
            res.view({ 
                title: "Client List", 
                scripts: arrScripts, 
                clients: clients
            });
        });
    },
    
    
    create: function(req, res, next) {
        Clients.create(req.params.all(), function clientCreated(err, client){
            if(err) return next(err);
            res.redirect('/clients/list/');
        });
    }

    
};

