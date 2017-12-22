var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback){

    // var res = {};
    // console.log("In handle request:"+ JSON.stringify(msg));
    //
    // if(msg.username == "janhudesai@gmail.com" && msg.password =="shardaben"){
    //     res.code = "200";
    //     res.value = "Success Login";
    //
    // }
    // else{
    //     res.code = "401";
    //     res.value = "Failed Login";
    // }
    // callback(null, res);
    var res = {};
    mongo.connect(mongoURL, function(){

        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Login");
        console.log("Collection"+" "+coll);

        coll.findOne({username: msg.username, password:msg.password}, function(err, user1){
            console.log("inside call back"+user1)

            if (user1) {
                res.code = "200";
                res.value = "Success Login";
                callback(null, res);

            } else {
                res.code = "400";
                res.value = "Failed Login";
                callback(null, res);
            }
        });

        console.log(res)

    });

}

exports.handle_request = handle_request;