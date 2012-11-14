var mongodb = require('mongodb');

var serverHost = "127.0.0.1";
var serverPort = 27017;
var databaseName = 'NodeNotes';

var getDb = function () {
  var server = new mongodb.Server(serverHost, serverPort, {});
  var db = new mongodb.Db(databaseName, server, { safe : true });
  return db;
}

var counter = function (db, name, callback) {
  db.collection('counters', function(err, collection){
    collection.findAndModify({_id:name}, [], {$inc : {next:1}}, {"new":true, upsert:true }, function(err, data){
      console.log(data)
      callback(data.next);
    });
  });
}

var insertOnConnectionOpened = function (collectionName, model, insertCallback){

  var connectionOpened = function (error, db) {
    if (error) throw error;

    counter(db, collectionName, function(id){
      model.id = id;

      console.log('Inserting', model);
      db.collection(collectionName, function(err, collection){
        var options = { };
        collection.insert(model, options, insertCallback);  
      });
    });

  };

  return connectionOpened;
};


exports.insert = function insert(collectionName, model, insertCallback){
  var db = getDb();
  var connectionOpened = insertOnConnectionOpened(collectionName, model, insertCallback);

  db.open(connectionOpened);
};



var queryOnConnectionOpened = function (collectionName, query, projection, queryCallback){

  var connectionOpened = function (error, db) {
    if (error) throw error;

    db.collection(collectionName, function(err, collection){
      var options = { };
      collection.find(query, projection).toArray(queryCallback);
    });
  };

  return connectionOpened;
};

exports.all = function(collectionName, projectionProperties, allCallback) {
  var db = getDb();
  var query = {};
  var projection = {};
  for (var i = projectionProperties.length - 1; i >= 0; i--) {
    projection[projectionProperties[i]] = projectionProperties[i];
  };
  var connectionOpened = queryOnConnectionOpened(collectionName, query, projection, allCallback);

  db.open(connectionOpened);
};
