var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/meanhotel";
var _connection = null;

var open = function(){
    //set _connection
    MongoClient.connect(dbUrl,function(err,client){
        if(err){
            console.log("DB connection failed");
            return;
        }
        _connection = client.db('meanhotel');
        console.log("DB connected",client);
    });
}

var get = function(){
    return _connection;
}

module.exports = {
    open:open,
    get:get
};