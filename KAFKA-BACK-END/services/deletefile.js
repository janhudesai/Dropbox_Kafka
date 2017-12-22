var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable={};
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Delete");
        console.log("Collection"+" "+coll);

        coll.update({username: msg.user},{$pull:{files:{name:msg.name}}},
            function(err, user1){
                console.log("inside call back"+user1);

                if (user1) {
                    resvariable.code = "200";
                    resvariable.value = "Success";
                    callback(null, resvariable);

                } else {
                    resvariable.code = "400";
                    resvariable.value = "Fail";
                    callback(null, resvariable);
                }
            });
    });
}

exports.handle_request = handle_request;