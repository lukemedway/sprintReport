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
     sprintdatefrom: {
       type: 'date'
     },
     sprintdateto: {
       type: 'date'
     },
     
     // One-to-many relationship with projects
     // Many sprints may belong to a project
     project: {
       model: 'projects'
     }, 

     // Many-to-many relationship with stories
     // Many stories can belong to many sprints
     
    //  story: {
       
    //  }
  }
  
};

