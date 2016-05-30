/**
 * Sprints.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
     projectid: {
       type: 'string',
       unique: true,
       required: true
     },
     projectname: {
       type: 'string',
       required: true
     },
     sprintid: {
       type: 'integer',
       autoincrement: true
     },
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
     }
     
  }
  
};

