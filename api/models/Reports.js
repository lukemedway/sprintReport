/**
 * Reports.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      reportdatefrom: {
        type: 'datetime'
      },
      reportdateto: {
        type: 'datetime'
      }
      
      
      // One-to-many relationship to stories
      // A report may have many stories
      // stories: {
      //   collection: 'stories',
      //   via: 'report'
      // }
      
  }
  
};

