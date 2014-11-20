var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


/*********************************************************************************************/
/* Use this block if you would like to use a remote database
/*********************************************************************************************/

// - Conect to the database hosted on a remote server
// - If the collection doesn't exist, it will be created at the first adding of new data
// - Change the <VALUE_INSIDE> for the corresponding value

var server = new Server('ds047440.mongolab.com', 47440, {auto_reconnect: true});
db = new Db('plantdb', server, {safe: true});

db.open(function(err, database) {
    database.authenticate("admin", "admin", function(err, res) {

        if (!err) {
            console.log("Connected to 'plantdb' database");

            database.collection('plants', {safe: true}, function(err, collection) {
                // If the collection "plants" doesn't exist
                if (err) {
                    console.log("The 'plants' collection doesn't exist yet.");
                }
            });
        }
        else {
            console.log("Failure attempting to connect to the database 'plantdb'@" + server.host);
        }
    });
});


/*********************************************************************************************/
/* Use this block if you would like to use a local database (with no user authentication)
*/
// - Conect to the database hosted on a remote server
// - If the collection doesn't exist, it will be created at the first adding of new data
// - Change the <VALUE_INSIDE> for the corresponding value
//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('plantdb', server, {safe: true});
//
//db.open(function(err, db) {
//if(!err) {
//    console.log("Connected to 'plantdb' database");
//
//    db.collection('plants', {safe:true}, function(err, collection) {
//        // If the collection "plants" doesn't exist
//        if (err) {
//             console.log("The 'plants' collection doesn't exist yet.");
//        }
//    });
//}
//else{
//    console.log("Failure attempting to connect to the database 'plantdb'@"+server.host);
//}
//});
 
/*************************************************************************************************/


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving plant: ' + id);
    db.collection('plants', function(err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('plants', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addPlant = function(req, res) {
    var plant = req.body;
    console.log('Adding plant: ' + JSON.stringify(plant));
    db.collection('plants', function(err, collection) {
        collection.insert(plant, {safe: true}, function(err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updatePlant = function(req, res) {
    var id = req.params.id;
    var plant = req.body;
    delete plant._id;
    console.log('Updating plant: ' + id);
    console.log(JSON.stringify(plant));
    db.collection('plants', function(err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, plant, {safe: true}, function(err, result) {
            if (err) {
                console.log('Error updating plant: ' + err);
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(plant);
            }
        });
    });
}

exports.deletePlant = function(req, res) {
    var id = req.params.id;
    console.log('Deleting plant: ' + id);
    db.collection('plants', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result) {
            if (err) {
                res.send({'error': 'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
