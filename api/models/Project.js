/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {
     name: {
       type: 'string',
       required: true,
       unique: true
     },
     jiraprojectref: {
       type: 'string',
       primaryKey: true,
       required: true,
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
     projectjiraboard: {
       type: 'integer'
     },
     projectjiraboarddesc: {
       type: 'string'
     },
     deleted: {
       type: 'boolean',
       defaultsTo: false
     },

     
     // Relationship to sprint
     // One-to-many: Project can have many sprints
     sprint: {
       collection: 'sprint',
       via: 'project'
     },
     
     
     // Relationshpip to dependency
     // One-to-many: Project can have many dependencies
     dependency: {
       collection: 'dependency',
       via: 'project'
     },

     // Relationship to story
     // One-to-many: Project can have many stories 
     story: {
       collection: 'story',
       via: 'project'
     }
  }
};

