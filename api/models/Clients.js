/**
 * Clients.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

     name: {
       type: 'string',
       required: true
     },
     jiraprojectref: {
       type: 'string',
       defaultsTo: ''
     },
     complete: {
       type: 'float',
       defaultsTo: 0
     },
     velocitytgt: {
       type: 'float',
       defaultsTo: 0
     },
     velocityavg: {
       type: 'float',
       defaultsTo: 0
     },
     deleted: {
       type: 'boolean',
       defaultsTo: false
     }
     
  }
  
};

