/**
 * Sprint.js
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
       defaultsTo: false
     },
     sprintdatefrom: {
       type: 'date'
     },
     sprintdateto: {
       type: 'date'
     },
     sprintvelocity: {
       type: 'float',
       defaultsTo: 0
     },
     sprintvelocitytarget: {
       type: 'float',
       defaultsTo: 0
     },
     sprintcompletion: {
       type: 'float',
       defaultsTo: 0
     },
     sprintnotes: {
       type: 'text'
     },     
     sprintissetup: {
       type: 'boolean',
       defaultsTo: false
     },
     
     // One-to-many relationship with projects
     // Many sprints may belong to a project
     project: {
       model: 'project'
     },

     // Many-to-many relationship with stories
     // Many stories can belong to many sprints
     story: {
       collection: 'story',
       via: 'sprintparents',
       dominant: true
     }

  }
  
};

