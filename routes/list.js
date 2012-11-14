var db = require('../database');

exports.index = function(req, res) {
	db.all('list', ['id', 'name'], function(err, data) {
		if (err) console.log(err);
		console.log('list', data);
		res.send(data);
	});
};

exports.detail = function(req, res) {
	var listId = parseInt(req.params.listId);
	db.one('list', { id : listId }, ['id', 'name', 'notes'], function(err, data) {
		if (err) console.log(err);
		console.log('detail', data);
		res.send(data);
	});
};

exports.save = function(req, res) {
	var listId = parseInt(req.params.listId);
	console.log('Posted', req.body)
	db.upsert('list', { id : listId }, req.body, function(err, data) {
		if (err) console.log(err);
		console.log('save', data);
		res.send(data);
	});
};

exports.add = function(req, res) {
	var name = req.body.name;
	db.insert('list', { name : name }, function(err, data){
		if (err) console.log(err);
		console.log('add', data)
		res.send(data);
	});
};