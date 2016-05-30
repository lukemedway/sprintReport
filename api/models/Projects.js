/**
 * Projects.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
     name: {
       type: 'string',
       required: true,
       unique: true
     },
     jiraprojectref: {
       type: 'string',
       defaultsTo: '',
       unique: true
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
     },
     
     // Relationship to sprint
     // One-to-many: project can have many sprints
     sprints: {
       collection: 'sprints',
       via: 'project'
     }
  }
};

