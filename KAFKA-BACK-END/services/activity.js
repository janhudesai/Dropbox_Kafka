var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable;
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Activity-----");
        var username = msg.username;
        console.log(username)

        coll.aggregate([
            {$match: {username:username}},
            {$project:
                {logs:{$filter:
                    {
                        input:'$logs',
                        as:'logs',
                        cond:{$eq:['$$logs.userid',username]}
                    }}
                }}
        ], function (err, user) {
            console.log("inside call back-----" + user);
            if (user) {
                //console.log(user[0].folders);
                resvariable = user[0].logs;
                console.log("output:"+resvariable);
                callback(null, resvariable);
            }
            else {
                callback(null, resvariable);
            }
        });
    });
}

exports.handle_request = handle_request;