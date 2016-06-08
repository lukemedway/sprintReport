
/**
 * Sequence.js
 *
 * @description :: This is a counter for use incrementing a value specifically for MongoDB
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// module.exports = {
//     attributes: {
//         num: {
//             type : "integer"
//         },
//     },

//     next: function(id, cb) {
//         Sequence.native(function(err, col) {
//             col.findAndModify(
//                 { _id: id },
//                 [[ '_id', 'asc' ]],
//                 { $inc: { num : 1 } },
//                 { new: true, upsert : true}, 
//                 function(err, data) {
//                     return cb(err, data.value.num);
//                 });
//         });
//     }
// };