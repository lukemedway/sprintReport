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
    
    getclients: function(req, res, next) {
        Clients.find().sort({ 'createdAt': -1 }).exec(function foundClients(err, clients){
            if(err) return next(err);
            if(!clients) return next(err);
            res.json(clients);
        });   
    },    
    
    list: function(req, res, next) {
        Clients.find().sort({ 'createdAt': -1 }).exec(function foundClients(err, clients){
            if(err) return next(err);
            if(!clients) return next();
            var arrScripts = [ "clients.js" ];
            res.view({ 
                title: "Client List", 
                scripts: arrScripts, 
                clients: clients
            });
        });
    },
   
   create: function(req, res, next) {
       Clients.create(req.params.all(), function createdClient(err, client) {
           if(err) return next(err);
           res.json(client);
       });
   },
   
   update: function(req, res, next) {
        if(req.param('id') !== '' && req.param('name') !== '') {
            Clients.update({ 'id' : req.param('id')}, req.params.all()).exec( function clientUpdated(err, client) {
                if(err) return next(err);
                res.json(client);
            });
        } else {
            return false;
        }
   }
    
    
    // create: function(req, res, next) {
    //     Clients.create(req.params.all(), function clientCreated(err, client){
    //         
    //         res.redirect('/clients/list/');
    //     });
    // }
    
};

