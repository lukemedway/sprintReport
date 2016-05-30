/**
 * Sprints.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
     // Data attributes
     sprintname: {
       type: 'string',
       required: true
     },
     sprintpublicurl: {
       type: 'string',
       required: true
     },
     sprintdeleted: {
       type: 'boolean',
       defaultsTo: 0
     },
     
     // Relationship
     project: {
       model: 'projects'
     } 
     
  }
  
};

