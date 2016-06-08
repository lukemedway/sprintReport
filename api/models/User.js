/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// var bcrypt = require('bcrypt');

// module.exports = {

//   attributes: {
//       useremailaddress: {
//         type: 'string',
//         required: true,
//         unique: true
//       },
//       userpassword: {
//         type: 'string',
//         required: true
//       },
//       userisadmin: {
//         type: 'boolean',
//         defaultsTo: false
//       },
//       toJSON: function() {
//         var objModel = this.toObject();
//         delete objModel.userpassword;
//         return objModel;
//       }
//   },
  
//   beforeCreate: function(users, next) {
//     bcrypt.genSalt(10, function(err, salt){
//       bcrypt.hash(users.userpassword), salt, function(err, hash) {
//         if (err) {
//           console.log(err);
//           next(err);
//         } else {
//           users.userpassword = hash;
//           next(null, users);
//         }
//       }
//     });
    
//   }
// };

