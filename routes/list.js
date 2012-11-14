var db = require('../database');

exports.index = function(req, res) {
	db.all('list', ['id', 'name'], function(err, data) {
		console.log(data);
		res.send(data);
	});
};

exports.detail = function(req, res) {
	var listId = parseInt(req.params.listId);
	db.one('list', { id : listId }, ['id', 'name', 'notes'], function(err, data) {
		console.log(data);
		res.send(data);
	});
};

exports.save = function(req, res) {
	var listId = parseInt(req.params.listId);
	console.log('Posted', req.body)
	db.upsert('list', { id : listId }, req.body, function(err, data) {
		console.log('Inserted', data);
		res.send(data);
	});
};

exports.add = function(req, res) {
	var name = req.body.name;
	db.insert('list', { name : name }, function(err){
		if (err) console.log(err);
	});

	res.send();
};