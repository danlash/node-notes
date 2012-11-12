exports.detail = function(req, res) {
	var listId = req.params.listId;
	//load from db
	res.send('{"id":2,"name":"Vacation Days","notes":[{"body":"10/24 - 10/25 ~ Matt Higgins","closed":true},{"body":"2012-11-11 ~ Dan Lash","closed":false},{"body":"Maecenas eu mi eu nisi accumsan sagittis a in augue. Duis ut orci erat, auctor rhoncus turpis. Aliquam tortor libero, eleifend eu molestie et, porttitor eu ligula. Curabitur blandit rutrum risus, quis pretium libero posuere sed. Integer adipiscing dignissim eros, id tristique leo sollicitudin auctor. Praesent in ipsum diam, sit amet iaculis lectus. Ut in diam mi. Pellentesque imperdiet suscipit odio et ultrices. Aenean blandit tellus vel orci semper euismod adipiscing augue hendrerit.","closed":false},{"body":"2012-12-31 ~ Dan Lash","closed":false}]}');
};

exports.save = function(req, res) {
}