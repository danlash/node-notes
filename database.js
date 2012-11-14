var mongodb = require('mongodb');

var dev = false;
var serverHost = dev ? "127.0.0.1" : 'alex.mongohq.com';
var serverPort = dev ? 27017 : 10071;
var databaseName = dev ? 'NodeNotes' : 'app9222257';
var user = 'admin';
var password = 'admin';

var getDb = function (gotDb) {
  var server = new mongodb.Server(serverHost, serverPort, {});
  var db = new mongodb.Db(databaseName, server, { safe : true });
  if (dev) {
    db.authenticate(user, password, function (err, result) {
      gotDb(result);
    });
  } else gotDb(db);
};

var counter = function (db, name, callback) {
  db.collection('counters', function(err, collection){
    collection.findAndModify({_id:name}, [], {$inc : {next:1}}, {"new":true, upsert:true }, function(err, data){
      console.log(data)
      callback(data.next);
    });
  });
};

var insertOnConnectionOpened = function(collectionName, model, insertCallback){

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


exports.insert = function(collectionName, model, insertCallback){
  var db = getDb(function(db){
  var connectionOpened = insertOnConnectionOpened(collectionName, model, insertCallback);

  db.open(connectionOpened);
  });
};


var upsertOnConnectionOpened = function(collectionName, query, model, upsertCallback){

  var connectionOpened = function (error, db) {
    if (error) throw error;

    db.collection(collectionName, function(err, collection){
      delete model._id; // weird but true
      collection.findAndModify(query, [], model, {"new":true, upsert:true }, upsertCallback);
    });

  };

  return connectionOpened;
};

exports.upsert = function(collectionName, query, model, upsertCallback){
  getDb(function(db){
      var connectionOpened = upsertOnConnectionOpened(collectionName, query, model, upsertCallback);

    db.open(connectionOpened);
  });
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
  getDb(function(db){
    var query = {};
    var projection = {};
    for (var i = projectionProperties.length - 1; i >= 0; i--) {
      projection[projectionProperties[i]] = true;
    };
    var connectionOpened = queryOnConnectionOpened(collectionName, query, projection, allCallback);

    db.open(connectionOpened);
  });
};

exports.one = function(collectionName, query, projectionProperties, oneCallback) {
  getDb(function(db){
    var projection = {};
    for (var i = projectionProperties.length - 1; i >= 0; i--) {
      projection[projectionProperties[i]] = true;
    };
    var connectionOpened = queryOnConnectionOpened(collectionName, query, projection, function(err, data){
      if (data.length === 0) { oneCallback(err, null); return }
      oneCallback(err, data[0]);
    });

    db.open(connectionOpened);
  });
};

