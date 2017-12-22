var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable;
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the list directory");
        var username = msg.username;

        coll.aggregate([
            {$match: {username:username}},
            {$project:
                {folders:{$filter:
                    {
                        input:'$folders',
                        as:'folders',
                        cond:{$eq:['$$folders.parentfolder',null]}
                    }}
                }}
        ], function (err, user) {
            console.log("inside call back" + user);
            if (user) {
                //console.log(user[0].folders);
                resvariable = user[0].folders;
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