/**
 * Dependency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    dependencyref: {
      type: 'integer'
    },
    dependencypriority: {
      type: 'string'
    },
    dependencydesc: {
      type: 'text'
    },
    dependencyassignee: {
      type: 'text'
    },
    dependencystatus: {
      type: 'text'
    },
    dependencydeleted: {
      type: 'boolean',
      defaultsTo: false
    },
    
    // Relationship attribute
    // One-to-many relationship with a project
    project: {
      model: 'project'
    }
    
  }
};

