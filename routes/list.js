var db = require('../database');

var lists = '[\
		{"id":0,"name":"Vacation Days"},\
		{"id":1,"name":"Retrospective Topics"},\
		{"id":2,"name":"Team Outing Ideas"}\
		]';

var details = [
		'{"id":0,"name":"Vacation Days","notes":[{"body":"10/24 - 10/25 ~ Matt Higgins","closed":true},{"body":"2012-11-11 ~ Dan Lash","closed":false},{"body":"Maecenas eu mi eu nisi accumsan sagittis a in augue. Duis ut orci erat, auctor rhoncus turpis. Aliquam tortor libero, eleifend eu molestie et, porttitor eu ligula. Curabitur blandit rutrum risus, quis pretium libero posuere sed. Integer adipiscing dignissim eros, id tristique leo sollicitudin auctor. Praesent in ipsum diam, sit amet iaculis lectus. Ut in diam mi. Pellentesque imperdiet suscipit odio et ultrices. Aenean blandit tellus vel orci semper euismod adipiscing augue hendrerit.","closed":false},{"body":"2012-12-31 ~ Dan Lash","closed":false}]}',
		'{"id":1,"name":"Retrospective Topics","notes":[{"body":"Sups","closed":false},{"body":"hi!!!!!!!!!!!!!!!!!!!!!!!!!","closed":true}]}',
		'{"id":2,"name":"Team Outing Ideas","notes":[{"body":"Here","closed":false},{"body":"there","closed":false},{"body":"anywhere","closed":false}]}'
	];

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