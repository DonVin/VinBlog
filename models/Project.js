//数据库操作

var mongoose = require('mongoose');
var usersSchema = require('../schemas/projects.js');

module.exports = mongoose.model('Project',usersSchema);
