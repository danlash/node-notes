exports.index = function(req, res) {
	res.send('[\
		{"id":0,"name":"Vacation Days"},\
		{"id":1,"name":"Retrospective Topics"},\
		{"id":2,"name":"Team Outing Ideas"}\
		]');
}

exports.detail = function(req, res) {
	var listId = req.params.listId;
	//load from db

	var lists = [
		'{"id":0,"name":"Vacation Days","notes":[{"body":"10/24 - 10/25 ~ Matt Higgins","closed":true},{"body":"2012-11-11 ~ Dan Lash","closed":false},{"body":"Maecenas eu mi eu nisi accumsan sagittis a in augue. Duis ut orci erat, auctor rhoncus turpis. Aliquam tortor libero, eleifend eu molestie et, porttitor eu ligula. Curabitur blandit rutrum risus, quis pretium libero posuere sed. Integer adipiscing dignissim eros, id tristique leo sollicitudin auctor. Praesent in ipsum diam, sit amet iaculis lectus. Ut in diam mi. Pellentesque imperdiet suscipit odio et ultrices. Aenean blandit tellus vel orci semper euismod adipiscing augue hendrerit.","closed":false},{"body":"2012-12-31 ~ Dan Lash","closed":false}]}',
		'{"id":1,"name":"Retrospective Topics","notes":[{"body":"Sups","closed":false},{"body":"hi!!!!!!!!!!!!!!!!!!!!!!!!!","closed":true}]}',
		'{"id":2,"name":"Team Outing Ideas","notes":[{"body":"Here","closed":false},{"body":"there","closed":false},{"body":"anywhere","closed":false}]}'
	];

	res.send(lists[listId]);
};

exports.save = function(req, res) {
}