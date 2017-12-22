var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    console.log("inside Update Star");
    var res={}


    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the update Stars")

        coll.update(
            {username:msg.username,'folders.name':msg.foldername},
            {
                $set: {
                    "folders.$.starred":msg.value

                }
            }
        , function (err, user) {
            //console.log("inside call back"+user)
            if (user) {
                res.code = 200;
                callback(null, res);
            }
            else {
                res.code = 400;
                callback(null, res);
            }
        });
    });


}

exports.handle_request = handle_request;