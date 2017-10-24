//数据库操作

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/comments.js');

module.exports = mongoose.model('Comment',contentsSchema);
