/**
 * Story.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {
      storyjiraref: {
        type: 'string',
        required: true,
        unique: true,
        primaryKey: true
      },
      storydesc: {
        type: 'text',
        required: true
      },
      storypriority: {
        type: 'string'
      },
      storystatus: {
        type: 'string'
      },
      storypoints: {
        type: 'float',
        defaultsTo: 0
      },
      storycomplete: {
        type: 'boolean',
        defaultsTo: false
      },
      storyiscommitment: {
        type: 'boolean',
        defaultsTo: true
      },
      storydeleted: {
        type: 'boolean',
        defaultsTo: false
      },
      
      // Many-to-many relationship to sprint
      // Many stories may belong to many sprints
      sprintparents: {
        collection: 'sprint',
        via: 'story'
      }
      
  }
  
};

