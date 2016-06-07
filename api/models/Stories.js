/**
 * Stories.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      storyjiraid: {
        type: 'string'
      },
      storydesc: {
        type: 'text',
        required: true
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
      
      // One-to-many relationship to reports
      // Many stories may belong to a report
      report: {
        model: 'reports'
      }  
      
  }
  
};

